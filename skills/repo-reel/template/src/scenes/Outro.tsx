import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { STORY } from "../story";
import { C, MONO, alpha } from "../theme";
import { clamp, ease, sp } from "../anim";
import type { Cue, OutroScene } from "../types";
import { Particles } from "../components/Particles";
import { Kinetic } from "../components/Text";
import { Flash } from "../components/Overlays";
import { Logo, logoAspect } from "../components/Brand";

const COLLAPSE = 72;
export const outroDur = 388;
export const outroCues = (): Cue[] => [
  { at: 0, sfx: "riser", vol: 0.5, trim: 192 - COLLAPSE },
  { at: COLLAPSE, sfx: "impact", vol: 1 },
  { at: COLLAPSE + 4, sfx: "shimmer", vol: 0.5 },
];

/** Particles collapse into a flash, logo returns with tagline + URL, fade to black. */
export const Outro: React.FC<{ cfg: OutroScene; duration: number }> = ({ cfg, duration }) => {
  const f = useCurrentFrame();
  const tagline = cfg.tagline ?? STORY.brand.tagline;
  const url = cfg.url ?? STORY.brand.url;
  const converge = ease(f, 0, COLLAPSE, (t) => t);
  const burst = interpolate(sp(f, COLLAPSE, { damping: 30, stiffness: 35 }), [0, 1], [0.02, 1.15]);
  const logo = sp(f, COLLAPSE, { damping: 14, stiffness: 90 });
  const shine = interpolate(f, [COLLAPSE + 40, COLLAPSE + 90], [-30, 130], clamp);
  const LW = Math.min(1000, 250 * logoAspect());
  const LH = LW / logoAspect();

  return (
    <AbsoluteFill>
      {f < COLLAPSE + 2 ? (
        <Particles count={200} seed="out" converge={converge} cx={960} cy={440} speed={0.6} />
      ) : (
        <Particles count={200} seed="out2" burst={burst} cx={960} cy={440} opacity={0.9} speed={0.5} />
      )}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 41%, ${alpha(C.glow, converge * 0.6)} 0%, ${alpha(C.gradB, converge * 0.25)} 8%, transparent ${10 + converge * 10}%)`,
          opacity: f < COLLAPSE + 10 ? 1 : 0,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 40% 26% at 50% 41%, ${alpha(C.gradB, 0.26 * logo * (0.7 + 0.3 * Math.sin(f / 20)))}, transparent 70%)` }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 440,
          transform: `translate(-50%, -50%) scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
          opacity: Math.min(1, logo * 1.5),
          filter: `blur(${interpolate(logo, [0, 1], [20, 0], clamp)}px) drop-shadow(0 0 40px ${alpha(C.gradB, 0.4)})`,
        }}
      >
        <Logo width={LW} shine={shine} />
      </div>
      <div style={{ position: "absolute", top: 440 + LH / 2 + 60, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <Kinetic text={tagline} delay={COLLAPSE + 40} stagger={0.55} size={44} weight={500} color={C.sub} align="center" letterSpacing={-0.005} />
        {url ? (
          <div
            style={{
              transform: `scale(${sp(f, COLLAPSE + 95, { damping: 12, stiffness: 160 })})`,
              fontFamily: MONO,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: C.soft,
              padding: "16px 40px",
              borderRadius: 999,
              border: `2px solid ${alpha(C.soft, 0.5)}`,
              background: alpha(C.primary, 0.12),
              boxShadow: `0 0 50px ${alpha(C.primary, 0.3)}`,
            }}
          >
            {url}
          </div>
        ) : null}
      </div>
      <Flash at={COLLAPSE} strength={0.9} length={36} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [duration - 70, duration - 8], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};
