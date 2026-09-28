import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../anim";
import { C, alpha } from "../theme";

/** Animated film grain + vignette on top of everything. */
export const GrainVignette: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.72) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Soft diagonal light beam sweeping across the frame (screen-blended "light leak"). */
export const LightSweep: React.FC<{ start: number; duration?: number; angle?: number; width?: number; intensity?: number }> = ({
  start,
  duration = 50,
  angle = 18,
  width = 520,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], clamp);
  if (p <= 0 || p >= 1) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: Math.sin(p * Math.PI) * intensity, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "-40%",
          left: `${interpolate(p, [0, 1], [-60, 160])}%`,
          width,
          height: "180%",
          transform: `translateX(-50%) rotate(${angle}deg)`,
          background: `linear-gradient(90deg, transparent, ${alpha(C.glow, 0.55)}, transparent)`,
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Radial flash on big reveals. */
export const Flash: React.FC<{ at: number; length?: number; strength?: number }> = ({ at, length = 28, strength = 0.7 }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [at, at + 3, at + length], [0, strength, 0], clamp);
  if (a <= 0) return null;
  return (
    <AbsoluteFill
      style={{ background: `radial-gradient(circle at 50% 50%, ${C.glow} 0%, transparent 60%)`, opacity: a, mixBlendMode: "screen", pointerEvents: "none" }}
    />
  );
};
