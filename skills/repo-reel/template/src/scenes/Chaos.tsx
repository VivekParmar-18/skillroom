import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { C, SANS, alpha, mix, tone } from "../theme";
import { clamp, ease, lerp, shake, sp } from "../anim";
import type { ChaosScene, Cue } from "../types";
import { Kinetic } from "../components/Text";
import { IconBadge } from "../components/Icon";
import { Flash } from "../components/Overlays";

const SNAP = 172;
const SLAM = 196;
export const chaosDur = 380;
export const chaosCues = (): Cue[] => [
  { at: 50, sfx: "key", vol: 0.35 },
  { at: 62, sfx: "key", vol: 0.3 },
  { at: 104, sfx: "key", vol: 0.3 },
  { at: SNAP - 4, sfx: "whoosh", vol: 0.6 },
  { at: SLAM, sfx: "impact", vol: 0.85 },
  { at: SLAM + 40, sfx: "tick", vol: 0.25 },
];

function chaosPos(i: number, f: number) {
  const t = f / 90;
  return {
    x: 160 + random(`cx${i}`) * 1600 + noise2D(`nx${i}`, t, i) * 70,
    y: 130 + random(`cy${i}`) * 820 + noise2D(`ny${i}`, i, t) * 50,
    rot: (random(`cr${i}`) - 0.5) * 50 + noise2D(`nr${i}`, t, 0) * 10,
    scale: 0.65 + random(`cs${i}`) * 0.55,
    blur: random(`cb${i}`) < 0.4 ? 3 + random(`cbb${i}`) * 5 : 0,
  };
}

const Chips: React.FC<{ cfg: ChaosScene }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const n = cfg.chips.length;
  const cols = n <= 6 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const CW = cols === 3 ? 440 : 372;
  const CH = 92;
  const GAP = 22;
  const GX = (1920 - (cols * CW + (cols - 1) * GAP)) / 2;
  const GY = 590 + (3 - rows) * 50;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 1 - ease(f, SNAP - 6, SNAP + 10) }}>
        {cfg.chips.map((_, i) => {
          const a = chaosPos(i, f), b = chaosPos((i * 5 + 3) % n, f);
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={alpha(i % 2 ? C.danger : C.warn, 0.32)} strokeWidth={2} strokeDasharray="6 10" strokeDashoffset={-f * 2} />
          );
        })}
      </svg>
      {cfg.chips.map((c, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const inRow = row === rows - 1 ? n - row * cols : cols; // centre a short last row
        const rowX = GX + ((cols - inRow) * (CW + GAP)) / 2;
        const gx = rowX + col * (CW + GAP) + CW / 2;
        const gy = GY + row * (CH + GAP) + CH / 2;
        const order = Math.abs(col - (cols - 1) / 2) + Math.abs(row - (rows - 1) / 2) * 0.8;
        const s = sp(f, SNAP + order * 3, { damping: 15, stiffness: 150, mass: 0.8 });
        const cp = chaosPos(i, f);
        const appear = sp(f, 6 + i * 4, { damping: 20 });
        const lit = ease(f, SLAM, SLAM + 20);
        const blur = Math.max(0, lerp(cp.blur, 0, Math.min(1, s)));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: lerp(cp.x, gx, s),
              top: lerp(cp.y, gy, s),
              width: CW,
              height: CH,
              transform: `translate(-50%,-50%) rotate(${lerp(cp.rot, 0, s)}deg) scale(${lerp(cp.scale, 1, s) * appear})`,
              filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
              opacity: Math.min(1, appear) * lerp(0.75, 1, s),
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 22px",
              boxSizing: "border-box",
              borderRadius: 22,
              background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
              border: `1.5px solid ${alpha(C.soft, 0.13 + 0.35 * lit)}`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 ${40 * lit}px ${alpha(C.primary, 0.25 * lit)}`,
              fontFamily: SANS,
              fontSize: 30,
              fontWeight: 650,
              color: C.ink,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <IconBadge name={c.icon} color={tone(c.tone, i)} size={54} />
            {c.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** RGB-split glitch wrapper. */
const Glitch: React.FC<{ children: React.ReactNode; f: number }> = ({ children, f }) => {
  const step = Math.floor(f / 3);
  const burst = random(`g${step}`) > 0.72;
  const dx = burst ? (random(`gx${step}`) - 0.5) * 22 : (random(`gs${step}`) - 0.5) * 4;
  const sliceY = random(`gy${step}`) * 100;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ textShadow: `${dx}px 0 ${alpha(C.danger, 0.85)}, ${-dx}px 0 ${alpha(C.info, 0.85)}` }}>{children}</div>
      {burst ? (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(${sliceY}% 0 ${Math.max(0, 100 - sliceY - 12)}% 0)`, transform: `translateX(${dx * 2}px)`, color: C.danger }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

/** Problem → answer: chaotic tangled chips snap into an ordered grid as the answer slams in. */
export const Chaos: React.FC<{ cfg: ChaosScene }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const sk = shake(f, SLAM, 22, 30);
  const slam = sp(f, SLAM - 8, { damping: 11, stiffness: 190, mass: 0.9 });
  const out = ease(f, SNAP - 20, SNAP);
  const answerSize = Math.min(170, 2600 / Math.max(8, cfg.answer.length));

  return (
    <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px) scale(${interpolate(f, [0, chaosDur], [1, 1.05])})` }}>
      <CameraMotionBlur shutterAngle={200} samples={6}>
        <Chips cfg={cfg} />
      </CameraMotionBlur>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 16}px)` : undefined, transform: `scale(${1 + out * 0.15})` }}>
        <div style={{ padding: "40px 80px", borderRadius: 40, background: `radial-gradient(ellipse at center, ${alpha(C.bg, 0.85)} 30%, ${alpha(C.bg, 0)} 75%)`, textAlign: "center" }}>
          <Kinetic text={cfg.problem[0]} delay={18} stagger={1.2} size={78} weight={600} color={C.sub} align="center" />
          <Glitch f={f}>
            <Kinetic text={cfg.problem[1]} delay={48} stagger={2} size={Math.min(150, 2200 / Math.max(8, cfg.problem[1].length))} weight={900} align="center" letterSpacing={-0.045} />
          </Glitch>
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", top: 205, width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: SANS,
            fontSize: answerSize,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            paddingBottom: 12,
            backgroundImage: `linear-gradient(95deg, ${mix(C.soft, "#ffffff", 0.8)} 0%, ${C.soft} 35%, ${C.gradB} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: Math.min(1, slam * 1.5),
            transform: `scale(${interpolate(slam, [0, 1], [2.4, 1])})`,
            filter: `blur(${interpolate(slam, [0, 1], [30, 0], clamp)}px) drop-shadow(0 0 40px ${alpha(C.primary, 0.45)})`,
          }}
        >
          {cfg.answer}
        </div>
        {cfg.sub ? (
          <div style={{ marginTop: 18 }}>
            <Kinetic text={cfg.sub} delay={SLAM + 40} stagger={0.9} size={44} weight={500} color={C.sub} align="center" letterSpacing={0} />
          </div>
        ) : null}
      </div>
      <Flash at={SLAM + 2} strength={0.45} />
    </AbsoluteFill>
  );
};
