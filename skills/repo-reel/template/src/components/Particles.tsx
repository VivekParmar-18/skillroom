import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { noise3D } from "@remotion/noise";
import { C, H, W } from "../theme";
import { clamp } from "../anim";

type Props = {
  count?: number;
  seed?: string;
  /** 0 = free drift, 1 = every particle collapsed into (cx, cy). */
  converge?: number;
  /** 0 = all at (cx, cy), 1 = normal spread. Animate 0→1 for an explosion. */
  burst?: number;
  cx?: number;
  cy?: number;
  opacity?: number;
  speed?: number;
};

/** Noise-driven bokeh field with depth: far particles are small, dim and slow. */
export const Particles: React.FC<Props> = ({ count = 140, seed = "p", converge = 0, burst = 1, cx = W / 2, cy = H / 2, opacity = 1, speed = 1 }) => {
  const frame = useCurrentFrame();
  const items = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const z = random(`${seed}z${i}`);
        return {
          x: random(`${seed}x${i}`) * W,
          y: random(`${seed}y${i}`) * H,
          z,
          r: 0.8 + z * z * 4.2,
          hue: random(`${seed}h${i}`),
          tw: random(`${seed}t${i}`) * Math.PI * 2,
          lag: random(`${seed}l${i}`),
        };
      }),
    [count, seed],
  );
  const t = (frame / 60) * speed;

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          {[
            ["a", C.gradA],
            ["b", C.gradB],
          ].map(([k, col]) => (
            <radialGradient key={k} id={`p${k}-${seed}`}>
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="35%" stopColor={col} stopOpacity="0.9" />
              <stop offset="100%" stopColor={col} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        {items.map((p, i) => {
          const drift = 40 + p.z * 90;
          let x = p.x + noise3D(seed + "a", p.x / 700, p.y / 700, t * 0.15) * drift + t * (6 + p.z * 22);
          let y = p.y + noise3D(seed + "b", p.x / 700, p.y / 700, t * 0.15) * drift - t * (3 + p.z * 8);
          x = (((x % (W + 100)) + W + 100) % (W + 100)) - 50;
          y = (((y % (H + 100)) + H + 100) % (H + 100)) - 50;
          x = cx + (x - cx) * burst;
          y = cy + (y - cy) * burst;
          const c = interpolate(converge, [p.lag * 0.4, p.lag * 0.4 + 0.6], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          x += (cx - x) * c;
          y += (cy - y) * c;
          const twinkle = 0.55 + 0.45 * Math.sin(t * 2.2 + p.tw);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={p.r * (1 + c * 0.5) * 3}
              fill={`url(#p${p.hue > 0.5 ? "a" : "b"}-${seed})`}
              opacity={(0.15 + p.z * 0.75) * twinkle * (1 - c * 0.3)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
