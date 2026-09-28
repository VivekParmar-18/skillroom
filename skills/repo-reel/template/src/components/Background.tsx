import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { C, alpha } from "../theme";

/** Slow-drifting mesh gradient + faint perspective grid floor. Driven by the global frame. */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 600;
  const blob = (seed: string, bx: number, by: number, amp = 18) =>
    `${bx + noise2D(seed + "x", t, 0) * amp}% ${by + noise2D(seed + "y", 0, t) * amp}%`;

  const mesh = [
    `radial-gradient(ellipse 55% 60% at ${blob("a", 18, 20)}, ${alpha(C.gradA, 0.22)}, transparent 70%)`,
    `radial-gradient(ellipse 50% 55% at ${blob("b", 85, 30)}, ${alpha(C.gradB, 0.18)}, transparent 70%)`,
    `radial-gradient(ellipse 60% 50% at ${blob("c", 60, 95)}, ${alpha(C.deep, 0.35)}, transparent 70%)`,
    `radial-gradient(ellipse 35% 35% at ${blob("d", 30, 80, 25)}, ${alpha(C.violet, 0.08)}, transparent 70%)`,
  ].join(",");
  const line = alpha(C.soft, 0.13);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: mesh }} />
      <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 30%", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: "-50%",
            width: "200%",
            top: "52%",
            height: "120%",
            transform: "rotateX(72deg)",
            transformOrigin: "50% 0%",
            backgroundImage: `linear-gradient(${line} 1.5px, transparent 1.5px), linear-gradient(90deg, ${line} 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px",
            backgroundPosition: `0px ${(f * 0.6) % 80}px`,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 45%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 45%, transparent 90%)",
            opacity: 0.55,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
