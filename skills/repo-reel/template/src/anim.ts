import { getPointAtLength } from "@remotion/paths";
import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Eased 0→1 between two frames. */
export const ease = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = Easing.bezier(0.22, 1, 0.36, 1),
) => interpolate(frame, [from, to], [0, 1], { ...clamp, easing });

/** Spring that starts at `delay`. */
export const sp = (
  frame: number,
  delay = 0,
  config: Partial<{ damping: number; stiffness: number; mass: number }> = {},
  durationInFrames?: number,
) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: 16, stiffness: 120, mass: 0.9, ...config },
    durationInFrames,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Deterministic pseudo-random in [0,1). */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Decaying screen shake starting at `at`. */
export const shake = (frame: number, at: number, strength = 18, length = 26) => {
  const t = frame - at;
  if (t < 0 || t > length) return { x: 0, y: 0 };
  const k = Math.pow(1 - t / length, 2) * strength;
  return { x: (hash(t * 3.1 + at) - 0.5) * 2 * k, y: (hash(t * 7.7 + at) - 0.5) * 2 * k };
};

/** Null-safe point on an SVG path (getPointAtLength is typed nullable). */
export const pointAt = (path: string, length: number) => getPointAtLength(path, length) ?? { x: 0, y: 0 };
