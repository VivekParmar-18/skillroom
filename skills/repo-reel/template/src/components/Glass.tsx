import React from "react";
import { C, SANS, alpha } from "../theme";

/** Card surface: lit top edge, deep shadow, optional coloured glow. Opaque-ish so it reads over anything. */
export const cardStyle = (color?: string, opts: { radius?: number; solid?: boolean } = {}): React.CSSProperties => ({
  borderRadius: opts.radius ?? 24,
  boxSizing: "border-box",
  background: opts.solid
    ? `linear-gradient(160deg, ${alpha("#1E2A32", 0.96)}, ${alpha("#0C1319", 0.96)})`
    : "linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))",
  border: `1.5px solid ${color ? alpha(color, 0.35) : "rgba(255,255,255,0.13)"}`,
  boxShadow: [
    "0 24px 60px rgba(0,0,0,0.45)",
    color ? `0 0 40px ${alpha(color, 0.14)}` : "",
    "inset 0 1.5px 0 rgba(255,255,255,0.2)",
  ]
    .filter(Boolean)
    .join(","),
  fontFamily: SANS,
  color: C.ink,
});

/** Rounded status / label pill. */
export const Pill: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties; size?: number; dot?: boolean }> = ({
  children,
  color = C.soft,
  style,
  size = 26,
  dot = true,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      background: alpha(color, 0.12),
      border: `1.5px solid ${alpha(color, 0.4)}`,
      color,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {dot ? <span style={{ width: size * 0.38, height: size * 0.38, borderRadius: 99, background: color, boxShadow: `0 0 ${size * 0.5}px ${color}` }} /> : null}
    {children}
  </div>
);

/** Skeleton bar used to suggest UI text. */
export const Bar: React.FC<{ w: number | string; h?: number; color?: string; style?: React.CSSProperties }> = ({ w, h = 14, color = "rgba(255,255,255,0.14)", style }) => (
  <div style={{ width: w, height: h, borderRadius: h, background: color, ...style }} />
);
