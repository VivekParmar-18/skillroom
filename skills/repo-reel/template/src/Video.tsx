import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming, TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { pushCut } from "@remotion/transitions/push-cut";
import { STORY } from "./story";
import { C } from "./theme";
import type { Cue, SceneConfig } from "./types";
import { Background } from "./components/Background";
import { Particles } from "./components/Particles";
import { GrainVignette } from "./components/Overlays";
import { zoomThrough } from "./components/Transitions";
import { Title, titleCues, titleDur } from "./scenes/Title";
import { Chaos, chaosCues, chaosDur } from "./scenes/Chaos";
import { Journey, journeyCues, journeyDur } from "./scenes/Journey";
import { Flow, flowCues, flowDur } from "./scenes/Flow";
import { Orbit, orbitCues, orbitDur } from "./scenes/Orbit";
import { Dashboard, dashboardCues, dashboardDur } from "./scenes/Dashboard";
import { Trust, trustCues, trustDur } from "./scenes/Trust";
import { Stats, statsCues, statsDur } from "./scenes/Stats";
import { Showcase, showcaseCues, showcaseDur } from "./scenes/Showcase";
import { Outro, outroCues, outroDur } from "./scenes/Outro";

/** Scenes that carry a numbered eyebrow ("01 / …"). */
const NUMBERED = new Set(["journey", "flow", "orbit", "dashboard", "trust", "stats"]);

const resolve = (cfg: SceneConfig, index: string): { el: (dur: number) => React.ReactNode; dur: number; cues: Cue[] } => {
  switch (cfg.type) {
    case "title":
      return { el: () => <Title cfg={cfg} />, dur: cfg.dur ?? titleDur, cues: titleCues() };
    case "chaos":
      return { el: () => <Chaos cfg={cfg} />, dur: cfg.dur ?? chaosDur, cues: chaosCues() };
    case "journey":
      return { el: () => <Journey cfg={cfg} index={index} />, dur: cfg.dur ?? journeyDur, cues: journeyCues(cfg) };
    case "flow":
      return { el: () => <Flow cfg={cfg} index={index} />, dur: cfg.dur ?? flowDur, cues: flowCues(cfg) };
    case "orbit":
      return { el: () => <Orbit cfg={cfg} index={index} />, dur: cfg.dur ?? orbitDur, cues: orbitCues(cfg) };
    case "dashboard":
      return { el: () => <Dashboard cfg={cfg} index={index} />, dur: cfg.dur ?? dashboardDur, cues: dashboardCues(cfg) };
    case "trust":
      return { el: () => <Trust cfg={cfg} index={index} />, dur: cfg.dur ?? trustDur, cues: trustCues(cfg) };
    case "stats":
      return { el: () => <Stats cfg={cfg} index={index} />, dur: cfg.dur ?? statsDur, cues: statsCues(cfg) };
    case "showcase":
      return { el: () => <Showcase cfg={cfg} />, dur: cfg.dur ?? showcaseDur, cues: showcaseCues() };
    case "outro":
      return { el: (dur) => <Outro cfg={cfg} duration={dur} />, dur: cfg.dur ?? outroDur, cues: outroCues() };
  }
};

let counter = 0;
const SCENES = STORY.scenes.map((cfg) => {
  const index = NUMBERED.has(cfg.type) ? String(++counter).padStart(2, "0") : "";
  return resolve(cfg, index);
});

// Rotate CSS-only transitions (shader transitions need an experimental Chrome flag — avoid).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PRESETS: TransitionPresentation<any>[] = [
  zoomThrough({ strength: 0.4 }),
  pushCut({ flashColor: C.glow, flashOpacity: 0.35, flashFrames: 4 }),
  zoomThrough({ strength: 0.3 }),
];
const TRANSITIONS = SCENES.slice(1).map((_, i) => {
  const intoOutro = STORY.scenes[i + 1].type === "outro";
  return { dur: intoOutro ? 30 : 24, p: intoOutro ? fade() : PRESETS[i % PRESETS.length] };
});

/** Global start frame of each scene (scenes overlap during transitions). */
const STARTS = SCENES.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur - TRANSITIONS[i - 1].dur);
  return acc;
}, []);
export const TOTAL = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

const CUES = [
  ...SCENES.flatMap((s, i) => s.cues.map((c) => ({ ...c, from: STARTS[i] + c.at }))),
  ...STARTS.slice(1).map((st) => ({ at: 0, from: st - 2, sfx: "whoosh-short" as const, vol: 0.45, trim: undefined })),
];

const cut = Easing.bezier(0.7, 0, 0.2, 1);
const music = STORY.musicVolume ?? 0.32;

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Background />
    <Particles count={70} seed="ambient" opacity={0.35} speed={0.5} />
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const items = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.dur}>
            {s.el(s.dur)}
          </TransitionSeries.Sequence>,
        ];
        if (i < TRANSITIONS.length) {
          items.push(
            <TransitionSeries.Transition key={`t${i}`} presentation={TRANSITIONS[i].p} timing={linearTiming({ durationInFrames: TRANSITIONS[i].dur, easing: cut })} />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    <GrainVignette />
    {music > 0 ? (
      <Audio
        src={staticFile("sfx/pad.wav")}
        loop
        volume={(f) => interpolate(f, [0, 60, TOTAL - 120, TOTAL], [0, music, music, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    ) : null}
    {CUES.map((c, i) => {
      const from = Math.max(0, c.from);
      if (from >= TOTAL) return null;
      return (
        <Sequence key={i} from={from} durationInFrames={Math.min(360, TOTAL - from)} layout="none">
          <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={c.vol ?? 0.5} trimBefore={c.trim} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
