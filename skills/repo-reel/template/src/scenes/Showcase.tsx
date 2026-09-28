import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, MONO, SANS, alpha, tone } from "../theme";
import { sp } from "../anim";
import type { Cue, ShowcaseScene } from "../types";
import { Kinetic } from "../components/Text";
import { LightSweep } from "../components/Overlays";
import { cardStyle } from "../components/Glass";

const FAN = 44;
const SWEEP = 170;
export const showcaseDur = 330;
export const showcaseCues = (): Cue[] => [
  { at: FAN - 4, sfx: "whoosh", vol: 0.55 },
  { at: SWEEP - 10, sfx: "shimmer", vol: 0.4 },
];

/** 1–3 cards (brands, apps, editions) rise as a stack, fan out in 3D with floor reflections, then a sheen passes. */
export const Showcase: React.FC<{ cfg: ShowcaseScene }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const rise = sp(f, 6, { damping: 18, stiffness: 80 });
  const drift = Math.sin(f / 60) * 3;
  const cards = cfg.cards.slice(0, 3);
  const n = cards.length;
  const spread = n === 3 ? 580 : 330;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 110, width: "100%", display: "flex", justifyContent: "center", gap: 28 }}>
        <Kinetic text={cfg.title[0]} delay={8} stagger={1.3} size={88} />
        <Kinetic text={cfg.title[1]} delay={26} stagger={1.3} size={88} gradient />
      </div>
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 45%" }}>
        {cards.map((b, i) => {
          const off = i - (n - 1) / 2; // -1, 0, 1
          const col = tone(b.tone, i);
          const fan = sp(f, FAN + Math.abs(off) * 6, { damping: 14, stiffness: 90 });
          const stack = (1 - fan) * off * 24;
          const sweep = interpolate(f, [SWEEP + i * 8, SWEEP + 50 + i * 8], [-20, 120]);
          return (
            <div
              key={i}
              style={
                {
                  ...cardStyle(col, { radius: 32, solid: true }),
                  position: "absolute",
                  left: 960 - 260,
                  top: 355,
                  width: 520,
                  height: 360,
                  transform: `translateX(${off * spread * fan + stack}px) translateY(${(1 - rise) * 200 + stack}px) translateZ(${(off === 0 ? 40 : -60) * fan}px) rotateY(${-off * 24 * fan + drift}deg)`,
                  opacity: Math.min(1, rise * 1.4),
                  zIndex: off === 0 ? 3 : 1,
                  padding: "40px 36px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 60px ${alpha(col, 0.15)}, inset 0 1.5px 0 rgba(255,255,255,0.2)`,
                  WebkitBoxReflect: "below 18px linear-gradient(transparent 62%, rgba(255,255,255,0.16))",
                  overflow: "hidden",
                } as React.CSSProperties
              }
            >
              <div style={{ height: 140, maxWidth: 448, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                {b.logo ? <Img src={staticFile(b.logo)} style={{ height: b.logoHeight ?? 110, maxWidth: b.wordmark ? 180 : 440, objectFit: "contain" }} /> : null}
                {b.wordmark ? (
                  <div style={{ fontFamily: SANS, fontSize: b.logo ? 48 : 62, fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", whiteSpace: "nowrap" }}>{b.wordmark}</div>
                ) : null}
              </div>
              <div style={{ fontSize: 25, fontWeight: 500, lineHeight: 1.35, color: C.sub, textAlign: "center", maxWidth: 420 }}>{b.tagline}</div>
              {b.url ? <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 600, letterSpacing: "0.12em", color: col }}>{b.url}</div> : <div />}
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 15}%, rgba(255,255,255,0.14) ${sweep}%, transparent ${sweep + 15}%)` }} />
            </div>
          );
        })}
      </AbsoluteFill>
      {cfg.sub ? (
        <div style={{ position: "absolute", top: 960, width: "100%" }}>
          <Kinetic text={cfg.sub} delay={120} stagger={0.6} size={36} weight={500} color={C.sub} align="center" letterSpacing={0} />
        </div>
      ) : null}
      <LightSweep start={SWEEP - 10} duration={70} intensity={0.45} />
    </AbsoluteFill>
  );
};
