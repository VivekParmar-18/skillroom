import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SANS, alpha, mix } from "../theme";
import { clamp, ease, sp } from "../anim";

type KineticProps = {
  text: string;
  delay?: number;
  /** frames between characters */
  stagger?: number;
  size?: number;
  weight?: number;
  color?: string;
  /** colour each character along the brand gradient (per-char, because background-clip breaks on transformed spans) */
  gradient?: boolean;
  exitAt?: number;
  letterSpacing?: number;
  style?: React.CSSProperties;
  align?: "left" | "center" | "right";
  font?: string;
  lineHeight?: number;
};

/** Per-character kinetic typography: rise + de-blur + fade, with optional staggered exit. */
export const Kinetic: React.FC<KineticProps> = ({
  text,
  delay = 0,
  stagger = 1.6,
  size = 96,
  weight = 800,
  color = C.ink,
  gradient = false,
  exitAt,
  letterSpacing = -0.03,
  style,
  align = "left",
  font = SANS,
  lineHeight = 1.05,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  let idx = 0;
  return (
    <div style={{ fontFamily: font, fontSize: size, fontWeight: weight, letterSpacing: `${letterSpacing}em`, lineHeight, color, textAlign: align, ...style }}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {w.split("").map((ch) => {
              const i = idx++;
              const s = sp(frame, delay + i * stagger, { damping: 14, stiffness: 140 });
              const out = exitAt !== undefined ? ease(frame, exitAt + i * 0.7, exitAt + i * 0.7 + 16) : 0;
              const blur = (1 - Math.min(1, s)) * 14 + out * 12;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, s * 1.4) * (1 - out),
                    transform: `translateY(${(1 - s) * 0.55 - out * 0.35}em) scale(${0.9 + 0.1 * Math.min(s, 1.05)})`,
                    filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                    color: gradient ? mix(C.gradA, C.gradB, total > 1 ? i / (total - 1) : 0) : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Section label: "03 / EVERYONE CONNECTED" with a growing gradient rule. */
export const Eyebrow: React.FC<{ index: string; label: string; delay?: number }> = ({ index, label, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, delay, delay + 30);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 70 * p, height: 3, borderRadius: 3, background: `linear-gradient(90deg, ${C.gradA}, ${C.gradB})`, boxShadow: `0 0 16px ${C.soft}` }} />
      <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, letterSpacing: "0.28em", color: C.soft, opacity: p, transform: `translateX(${(1 - p) * -20}px)` }}>
        {index}
        <span style={{ color: C.muted, margin: "0 14px" }}>/</span>
        <span style={{ color: C.sub }}>{label.toUpperCase()}</span>
      </div>
    </div>
  );
};

/** Standard scene header: eyebrow + headline words (last word/line gradient). */
export const Header: React.FC<{ index: string; eyebrow: string; lines?: string[]; inline?: string[]; size?: number }> = ({
  index,
  eyebrow,
  lines,
  inline,
  size = 76,
}) => (
  <div style={{ position: "absolute", left: 140, top: 92, zIndex: 400 }}>
    <Eyebrow index={index} label={eyebrow} delay={4} />
    {lines ? (
      <div style={{ marginTop: 22 }}>
        {lines.map((l, i) => (
          <Kinetic key={i} text={l} delay={14 + i * 20} stagger={1.2} size={size} gradient={i === lines.length - 1 && lines.length > 1} />
        ))}
      </div>
    ) : null}
    {inline ? (
      <div style={{ marginTop: 22, display: "flex", gap: 22 }}>
        {inline.map((w, i) => (
          <Kinetic key={i} text={w} delay={12 + i * 18} stagger={1.3} size={size} gradient={i === inline.length - 1 && inline.length > 1} />
        ))}
      </div>
    ) : null}
  </div>
);

/** Animated number counter (ease-out quart). */
export const Counter: React.FC<{
  from?: number;
  to: number;
  start: number;
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, start, end, decimals = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, end], [0, 1], clamp);
  const v = from + (to - from) * (1 - Math.pow(1 - t, 4));
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/** Small "ILLUSTRATIVE DATA" disclaimer for mock numbers. */
export const Illustrative: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        top: 104,
        fontFamily: MONO,
        fontSize: 16,
        color: alpha(C.muted, 0.8),
        letterSpacing: "0.2em",
        opacity: interpolate(f, [60, 90], [0, 1], clamp),
        ...style,
      }}
    >
      ILLUSTRATIVE DATA
    </div>
  );
};
