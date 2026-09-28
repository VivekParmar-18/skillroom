import React from "react";
import { alpha } from "../theme";

/** 24×24 stroke icons. Add more by appending a path (stroke-only, round caps). */
const PATHS = {
  building: "M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16 M16 9h2a2 2 0 0 1 2 2v10 M3 21h18 M8 7h4 M8 11h4 M8 15h4",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  receipt: "M6 2h12v20l-3-2-3 2-3-2-3 2z M9 7h6 M9 11h6 M9 15h4",
  briefcase: "M3 7h18v13H3z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M3 13h18",
  factory: "M2 20h20 M4 20V10l5 3V10l5 3V10l5 3v7 M18 13V4h2v9",
  shield: "M12 2l8 3v6c0 5-3.5 9-8 11c-4.5-2-8-6-8-11V5z M9 12l2 2l4-4",
  package: "M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8",
  check: "M5 12.5l4.5 4.5L19 7.5",
  card: "M2 6h20v12H2z M2 10h20 M6 15h4",
  bank: "M3 10h18 M12 3l9 5H3z M5 10v8 M9 10v8 M15 10v8 M19 10v8 M3 20h18",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
  key: "M15 7a4 4 0 1 0 0.01 0 M12.2 10.8L3 20 M6 17l2 2 M8 15l2 2",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h5",
  history: "M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 7v5l3 3",
  truck: "M1 4h14v12H1z M15 8h4l3 3v5h-7z M3.5 18.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M16.5 18.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  clipboard: "M9 2h6v4H9z M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 14l2 2 4-4",
  cog: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M12 1v3 M12 20v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M1 12h3 M20 12h3 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1",
  form: "M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h4",
  coins: "M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3s-3.6-3-8-3s-8 1.3-8 3 M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  spark: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z",
  chart: "M3 3v18h18 M7 15l4-4 3 3 5-6",
  bars: "M4 20V10 M10 20V4 M16 20v-8 M22 20H2",
  cart: "M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6 M9 21a1 1 0 1 0 0.01 0 M20 21a1 1 0 1 0 0.01 0",
  mail: "M2 5h20v14H2z M2 6l10 7 10-7",
  phone: "M5 2h14v20H5z M10 18h4",
  calendar: "M3 5h18v16H3z M3 10h18 M8 2v5 M16 2v5",
  globe: "M12 2a10 10 0 1 0 0.01 0 M2 12h20 M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20",
  cloud: "M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z",
  server: "M2 3h20v7H2z M2 14h20v7H2z M6 6.5h.01 M6 17.5h.01",
  database: "M4 5c0 1.7 3.6 3 8 3s8-1.3 8-3s-3.6-3-8-3s-8 1.3-8 3 M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  terminal: "M4 17l6-5-6-5 M12 19h8",
  git: "M6 3v12 M18 9a3 3 0 1 0 0.01 0 M6 21a3 3 0 1 0 0.01 0 M18 12a9 9 0 0 1-9 9",
  plug: "M12 22v-5 M9 8V2 M15 8V2 M18 8v5a6 6 0 0 1-12 0V8z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9z",
  layers: "M12 2l10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5",
  rocket: "M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2 M12 15l-3-3 M9 12a22 22 0 0 1 11-10c0 3-1 8-10 13z M14 9a1 1 0 1 0 0.01 0",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  search: "M11 3a8 8 0 1 0 0.01 0 M21 21l-4.35-4.35",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z M8 2v16 M16 6v16",
  cpu: "M5 5h14v14H5z M9 9h6v6H9z M9 1v4 M15 1v4 M9 19v4 M15 19v4 M1 9h4 M1 15h4 M19 9h4 M19 15h4",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z M12 9a3 3 0 1 0 0.01 0",
  flag: "M4 22V4 M4 4h13l-2 4 2 4H4",
} as const;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({
  name,
  size = 28,
  color = "currentColor",
  stroke = 2,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <path d={PATHS[name] ?? PATHS.spark} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Icon inside a glowing tinted tile. */
export const IconBadge: React.FC<{ name: IconName; color: string; size?: number }> = ({ name, color, size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.32,
      background: `linear-gradient(145deg, ${alpha(color, 0.25)}, ${alpha(color, 0.08)})`,
      border: `1.5px solid ${alpha(color, 0.44)}`,
      boxShadow: `0 0 ${size * 0.5}px ${alpha(color, 0.25)}, inset 0 1px 0 rgba(255,255,255,0.25)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.52} color={color} stroke={2.2} />
  </div>
);
