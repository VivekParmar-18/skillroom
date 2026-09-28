// Synthesizes every sound used in the video. No samples, no licensing.
// Output: 16-bit stereo PCM WAV files in public/sfx/.
// Usage: node scripts/gen-sfx.mjs [--pad=<seconds>]   (music bed length; use video length + 2)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 48000;
const PAD_SEC = Number((process.argv.find((a) => a.startsWith("--pad=")) || "").slice(6)) || 62;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
let seed = 1337;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;
const TAU = Math.PI * 2;
const buf = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];

/** RBJ biquad; returns a stateful per-sample processor whose coeffs can be updated. */
const biquad = (type) => {
  let b0 = 1, b1 = 0, b2 = 0, a1 = 0, a2 = 0, x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return {
    set(freq, q = 0.707) {
      const w = (TAU * Math.min(freq, SR * 0.45)) / SR;
      const cos = Math.cos(w), alpha = Math.sin(w) / (2 * q);
      let nb0, nb1, nb2;
      if (type === "lp") { nb0 = (1 - cos) / 2; nb1 = 1 - cos; nb2 = (1 - cos) / 2; }
      else if (type === "hp") { nb0 = (1 + cos) / 2; nb1 = -(1 + cos); nb2 = (1 + cos) / 2; }
      else { nb0 = alpha; nb1 = 0; nb2 = -alpha; } // band-pass
      const a0 = 1 + alpha;
      b0 = nb0 / a0; b1 = nb1 / a0; b2 = nb2 / a0; a1 = (-2 * cos) / a0; a2 = (1 - alpha) / a0;
    },
    run(x) {
      const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      return y;
    },
  };
};

/** Cheap stereo room: a few feedback delays with different lengths per channel. */
const reverb = ([L, R], mix = 0.3, decay = 0.55) => {
  const taps = [[1557, 1617], [1491, 1422], [1277, 1356], [1116, 1188]];
  const outL = new Float32Array(L.length), outR = new Float32Array(R.length);
  for (const [tl, tr] of taps) {
    const dl = new Float32Array(tl), dr = new Float32Array(tr);
    let il = 0, ir = 0;
    for (let i = 0; i < L.length; i++) {
      const yl = dl[il], yr = dr[ir];
      dl[il] = L[i] + yl * decay; dr[ir] = R[i] + yr * decay;
      il = (il + 1) % tl; ir = (ir + 1) % tr;
      outL[i] += yl / taps.length; outR[i] += yr / taps.length;
    }
  }
  for (let i = 0; i < L.length; i++) {
    L[i] = L[i] * (1 - mix) + outL[i] * mix * 2.2;
    R[i] = R[i] * (1 - mix) + outR[i] * mix * 2.2;
  }
  return [L, R];
};

const normalize = ([L, R], peak = 0.89) => {
  let m = 0;
  for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = m > 0 ? peak / m : 1;
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
  return [L, R];
};

const fadeEdges = ([L, R], inSec = 0.004, outSec = 0.02) => {
  const fi = Math.floor(inSec * SR), fo = Math.floor(outSec * SR);
  for (let i = 0; i < fi; i++) { L[i] *= i / fi; R[i] *= i / fi; }
  for (let i = 0; i < fo; i++) { const k = i / fo, j = L.length - 1 - i; L[j] *= k; R[j] *= k; }
  return [L, R];
};

const writeWav = (name, [L, R]) => {
  const n = L.length, data = Buffer.alloc(44 + n * 4);
  data.write("RIFF", 0); data.writeUInt32LE(36 + n * 4, 4); data.write("WAVE", 8);
  data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34);
  data.write("data", 36); data.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  writeFileSync(join(OUT, `${name}.wav`), data);
  console.log(`  ${name}.wav  ${(n / SR).toFixed(2)}s`);
};

// ---------- sounds ----------

/** Airy whoosh: band-passed noise whose centre sweeps up then down, panned across. */
const whoosh = (dur = 1.1, from = 300, to = 5200) => {
  const out = buf(dur), bl = biquad("bp"), br = biquad("bp");
  for (let i = 0; i < out[0].length; i++) {
    const t = i / out[0].length;
    const env = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 2.2);
    const f = from * Math.pow(to / from, Math.sin(Math.PI * t * 0.9));
    bl.set(f, 1.4); br.set(f * 1.07, 1.4);
    const pan = t;
    out[0][i] = bl.run(noise()) * env * (1.2 - pan * 0.6);
    out[1][i] = br.run(noise()) * env * (0.6 + pan * 0.6);
  }
  return fadeEdges(normalize(reverb(out, 0.25), 0.8));
};

/** Cinematic impact: sub sine pitch drop + noise transient + long room tail. */
const impact = (dur = 2.6) => {
  const out = buf(dur), lp = biquad("lp");
  let ph = 0;
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    const f = 38 + 110 * Math.exp(-t * 9);
    ph += (TAU * f) / SR;
    const sub = Math.sin(ph) * Math.exp(-t * 1.9);
    lp.set(180 + 5000 * Math.exp(-t * 30));
    const crack = lp.run(noise()) * Math.exp(-t * 14) * 0.9;
    const s = Math.tanh((sub * 1.1 + crack) * 1.6);
    out[0][i] = s; out[1][i] = s;
  }
  return fadeEdges(normalize(reverb(out, 0.35, 0.62), 0.95));
};

/** Riser: detuned saw stack + noise, filter opening, pitch climbing. */
const riser = (dur = 3.2) => {
  const out = buf(dur), fl = biquad("lp"), fr = biquad("lp"), hp = biquad("hp");
  hp.set(1200);
  const phases = [0, 0, 0, 0];
  const det = [1, 1.006, 0.994, 2.003];
  for (let i = 0; i < out[0].length; i++) {
    const t = i / out[0].length;
    const f = 70 * Math.pow(9, Math.pow(t, 1.6));
    let saw = 0;
    for (let k = 0; k < 4; k++) {
      phases[k] = (phases[k] + (f * det[k]) / SR) % 1;
      saw += (phases[k] * 2 - 1) * (k === 3 ? 0.35 : 0.5);
    }
    const cut = 200 + 7000 * Math.pow(t, 2);
    fl.set(cut, 2); fr.set(cut * 1.05, 2);
    const env = Math.pow(t, 1.8) * (t > 0.97 ? (1 - t) / 0.03 : 1);
    const air = hp.run(noise()) * Math.pow(t, 3) * 0.6;
    out[0][i] = (fl.run(saw) + air) * env;
    out[1][i] = (fr.run(saw) + air) * env;
  }
  return fadeEdges(normalize(reverb(out, 0.3), 0.8), 0.01, 0.01);
};

/** UI tick: short high sine blip with a click. */
const tick = (freq = 2100, dur = 0.14) => {
  const out = buf(dur);
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    const s = Math.sin(TAU * freq * t) * Math.exp(-t * 55) + noise() * Math.exp(-t * 900) * 0.4;
    out[0][i] = s; out[1][i] = s;
  }
  return fadeEdges(normalize(out, 0.7));
};

/** Pop: quick upward sine sweep, used when UI elements appear. */
const pop = (dur = 0.28) => {
  const out = buf(dur);
  let ph = 0;
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    ph += (TAU * (420 + 900 * (1 - Math.exp(-t * 40)))) / SR;
    const s = Math.sin(ph) * Math.exp(-t * 22);
    out[0][i] = s; out[1][i] = s;
  }
  return fadeEdges(normalize(reverb(out, 0.2), 0.7));
};

/** Key click: highpassed noise burst for typing. */
const key = (dur = 0.07) => {
  const out = buf(dur), hp = biquad("hp");
  hp.set(2500);
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    const s = hp.run(noise()) * Math.exp(-t * 120) + Math.sin(TAU * 900 * t) * Math.exp(-t * 90) * 0.4;
    out[0][i] = s; out[1][i] = s;
  }
  return fadeEdges(normalize(out, 0.6));
};

/** Bell-like additive tone. */
const bell = (L, R, freq, start, amp, decay = 3) => {
  const partials = [[1, 1], [2.01, 0.45], [3.02, 0.22], [4.17, 0.1]];
  const s0 = Math.floor(start * SR);
  for (let i = s0; i < L.length; i++) {
    const t = (i - s0) / SR;
    let v = 0;
    for (const [m, a] of partials) v += Math.sin(TAU * freq * m * t) * a * Math.exp(-t * decay * m);
    v *= amp * Math.min(1, t * 400);
    L[i] += v; R[i] += v;
  }
};

/** Success chime: rising two-note arpeggio. */
const chime = () => {
  const out = buf(1.8);
  bell(out[0], out[1], 659.25, 0, 0.8);
  bell(out[0], out[1], 987.77, 0.09, 0.7);
  bell(out[0], out[1], 1318.5, 0.18, 0.45);
  return fadeEdges(normalize(reverb(out, 0.35), 0.75));
};

/** Shimmer: sparkling high chord with tremolo, for logo moments. */
const shimmer = (dur = 3) => {
  const out = buf(dur);
  const notes = [1046.5, 1318.5, 1567.98, 1975.53, 2637];
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.25) * Math.exp(-t * 1.1);
    let l = 0, r = 0;
    notes.forEach((f, k) => {
      const trem = 0.6 + 0.4 * Math.sin(TAU * (5 + k * 1.3) * t + k);
      l += Math.sin(TAU * f * t) * trem / notes.length;
      r += Math.sin(TAU * f * 1.003 * t + 1) * trem / notes.length;
    });
    out[0][i] = l * env; out[1][i] = r * env;
  }
  return fadeEdges(normalize(reverb(out, 0.5, 0.7), 0.6));
};

/** Ambient pad: slow-moving A-minor-add9 drone with detuned voices. Glues the cuts together. */
const pad = (dur = 62) => {
  const out = buf(dur), fl = biquad("lp"), fr = biquad("lp");
  const chords = [
    [110, 164.81, 220, 261.63, 329.63, 493.88], // Am(add9)
    [87.31, 130.81, 174.61, 220, 261.63, 392], // Fmaj7
    [98, 146.83, 196, 246.94, 293.66, 440], // G6
    [110, 164.81, 220, 261.63, 329.63, 493.88],
  ];
  const seg = dur / chords.length;
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    const ci = Math.min(chords.length - 1, Math.floor(t / seg));
    const local = (t - ci * seg) / seg;
    const next = chords[Math.min(chords.length - 1, ci + 1)];
    const xf = local > 0.85 ? (local - 0.85) / 0.15 : 0; // crossfade into next chord
    let l = 0, r = 0;
    for (let k = 0; k < 6; k++) {
      const a = chords[ci][k], b = next[k];
      const w = 1 / (1 + k * 0.5);
      l += (Math.sin(TAU * a * t) * (1 - xf) + Math.sin(TAU * b * t) * xf) * w;
      r += (Math.sin(TAU * a * 1.004 * t + k) * (1 - xf) + Math.sin(TAU * b * 1.004 * t + k) * xf) * w;
    }
    const breath = 0.75 + 0.25 * Math.sin(TAU * 0.07 * t);
    const cut = 700 + 500 * Math.sin(TAU * 0.03 * t);
    fl.set(cut); fr.set(cut);
    const env = Math.min(1, t / 4) * Math.min(1, (dur - t) / 5);
    out[0][i] = fl.run(l) * breath * env;
    out[1][i] = fr.run(r) * breath * env;
  }
  return fadeEdges(normalize(reverb(out, 0.4, 0.7), 0.7), 0.01, 0.5);
};

console.log("Synthesizing SFX →", OUT);
writeWav("whoosh", whoosh());
writeWav("whoosh-short", whoosh(0.6, 500, 7000));
writeWav("impact", impact());
writeWav("riser", riser());
writeWav("tick", tick());
writeWav("pop", pop());
writeWav("key", key());
writeWav("chime", chime());
writeWav("shimmer", shimmer());
writeWav("pad", pad(PAD_SEC));
