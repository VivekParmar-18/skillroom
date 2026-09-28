import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { STORY } from "./story";
import type { Tone } from "./types";

// Swap Inter for the product's own Google font if the repo uses one (import from @remotion/google-fonts/<Name>).
export const { fontFamily: SANS } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const FPS = 60;
export const W = 1920;
export const H = 1080;

const toRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const toHex = (rgb: number[]) => "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");

/** Mix two hex colours (t = 0 → a, 1 → b). */
export const mix = (a: string, b: string, t: number) => {
  const pa = toRgb(a), pb = toRgb(b);
  return toHex(pa.map((v, i) => v + (pb[i] - v) * t));
};
/** Hex → rgba() string. */
export const alpha = (hex: string, a: number) => `rgba(${toRgb(hex).join(",")},${a})`;

const P = STORY.brand.palette;
const soft = P.soft ?? mix(P.primary, "#ffffff", 0.35);

export const C = {
  bg: P.background ?? "#05090D",
  panel: mix(P.background ?? "#05090D", "#ffffff", 0.04),
  ink: "#F9FAFB",
  sub: "#C4CDD5",
  muted: "#919EAB",
  dim: "#637381",
  primary: P.primary,
  soft,
  deep: P.deep ?? mix(P.primary, "#000000", 0.55),
  glow: mix(soft, "#ffffff", 0.6),
  gradA: P.gradient?.[0] ?? P.primary,
  gradB: P.gradient?.[1] ?? soft,
  info: P.info ?? "#00B8D9",
  warn: P.warn ?? "#FFAB00",
  violet: P.violet ?? "#8E33FF",
  danger: P.danger ?? "#FF5630",
};
export const GRAD_MID = mix(C.gradA, C.gradB, 0.5);

export const tone = (t: Tone | undefined, fallbackIndex = 0): string => {
  const map: Record<Tone, string> = { primary: C.soft, info: C.info, warn: C.warn, violet: C.violet, danger: C.danger };
  if (t) return map[t];
  return [C.soft, C.info, C.warn, C.violet][fallbackIndex % 4];
};
