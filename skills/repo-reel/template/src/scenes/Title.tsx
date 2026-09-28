import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { STORY } from "../story";
import { C, alpha } from "../theme";
import { clamp, ease, sp } from "../anim";
import type { Cue, TitleScene } from "../types";
import { Particles } from "../components/Particles";
import { Kinetic } from "../components/Text";
import { Flash, LightSweep } from "../components/Overlays";
import { Logo, logoAspect } from "../components/Brand";

const REVEAL = 75;
const SHINE = 150;
export const titleDur = 300;
export const titleCues = (): Cue[] => [
  { at: 0, sfx: "riser", vol: 0.55, trim: 192 - REVEAL },
  { at: REVEAL - 6, sfx: "whoosh", vol: 0.5 },
  { at: REVEAL, sfx: "impact", vol: 0.9 },
  { at: SHINE - 10, sfx: "shimmer", vol: 0.45 },
];

/** Light filament ignites → splits open → logo wipes in behind a scanning edge → tagline. */
export const Title: React.FC<{ cfg: TitleScene }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const lines = cfg.lines ?? [STORY.brand.tagline];
  const LOGO_W = Math.min(1180, 300 * logoAspect());
  const LOGO_H = LOGO_W / logoAspect();
  const CY = 470;

  const line = ease(f, 5, REVEAL, Easing.bezier(0.7, 0, 0.3, 1));
  const open = ease(f, REVEAL, REVEAL + 30);
  const wipe = ease(f, REVEAL, REVEAL + 38, Easing.bezier(0.65, 0, 0.35, 1));
  const settle = sp(f, REVEAL, { damping: 20, stiffness: 70 });
  const burst = interpolate(sp(f, REVEAL - 4, { damping: 30, stiffness: 40 }), [0, 1], [0.04, 1]);
  const shine = interpolate(f, [SHINE, SHINE + 45], [-30, 130], clamp);
  const pulse = 0.6 + 0.4 * Math.sin(f / 22);

  return (
    <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, titleDur], [1, 1.07])})` }}>
      <Particles count={170} seed="ign" burst={burst} opacity={interpolate(f, [REVEAL - 10, REVEAL + 10], [0, 1], clamp)} speed={0.8} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 38% 26% at 50% 44%, ${alpha(C.gradB, 0.28 * wipe * pulse)}, transparent 70%),
                       radial-gradient(ellipse 22% 14% at 42% 44%, ${alpha(C.gradA, 0.35 * wipe)}, transparent 70%)`,
        }}
      />
      {/* filament */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: CY,
          width: 1500 * line,
          height: 3 + open * 240,
          transform: "translate(-50%, -50%)",
          borderRadius: 999,
          opacity: 1 - open,
          background: `linear-gradient(90deg, transparent, ${C.gradA}, #fff, ${C.gradB}, transparent)`,
          boxShadow: `0 0 30px ${C.soft}, 0 0 80px ${C.gradB}`,
          filter: `blur(${open * 30}px)`,
        }}
      />
      {/* logo */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: CY,
          transform: `translate(-50%, -50%) scale(${interpolate(settle, [0, 1], [1.14, 1])})`,
          filter: `blur(${interpolate(settle, [0, 1], [18, 0], clamp)}px) drop-shadow(0 0 40px ${alpha(C.gradB, 0.35)})`,
          clipPath: `inset(-20% ${100 - wipe * 100}% -20% 0)`,
        }}
      >
        <Logo width={LOGO_W} shine={shine} />
      </div>
      {wipe > 0 && wipe < 1 ? (
        <div
          style={{
            position: "absolute",
            top: CY - LOGO_H * 0.8,
            left: 960 - LOGO_W / 2 + LOGO_W * wipe,
            width: 4,
            height: LOGO_H * 1.6,
            transform: "translateX(-50%)",
            background: "linear-gradient(transparent, #fff, transparent)",
            boxShadow: `0 0 24px #fff, 0 0 60px ${C.gradB}`,
          }}
        />
      ) : null}
      <div style={{ position: "absolute", top: CY + LOGO_H / 2 + 70, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lines.map((l, i) => (
          <Kinetic
            key={i}
            text={l}
            delay={112 + i * 22}
            stagger={lines.length === 1 ? 0.7 : 1.2}
            size={lines.length === 1 ? 50 : i === 0 ? 58 : 66}
            weight={i === lines.length - 1 && lines.length > 1 ? 800 : 500}
            color={C.sub}
            gradient={i === lines.length - 1 && lines.length > 1}
            align="center"
            letterSpacing={-0.01}
          />
        ))}
      </div>
      <Flash at={REVEAL} strength={0.55} />
      <LightSweep start={SHINE - 10} duration={70} intensity={0.6} />
    </AbsoluteFill>
  );
};
