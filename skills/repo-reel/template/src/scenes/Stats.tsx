import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, MONO, SANS, alpha, mix, tone } from "../theme";
import { clamp, ease, sp } from "../anim";
import type { Cue, StatsScene } from "../types";
import { Counter, Header } from "../components/Text";
import { cardStyle } from "../components/Glass";

const tileAt = (i: number) => 40 + i * 12;
const tagAt = (i: number, n: number) => tileAt(n) + 60 + i * 5;
export const statsDur = 420;
export const statsCues = (cfg: StatsScene): Cue[] => [
  { at: 20, sfx: "whoosh", vol: 0.4 },
  ...cfg.stats.map((_, i): Cue => ({ at: tileAt(i), sfx: "pop", vol: 0.4 })),
  { at: tileAt(cfg.stats.length - 1) + 90, sfx: "chime", vol: 0.45 },
  ...(cfg.tags ?? []).slice(0, 10).map((_, i): Cue => ({ at: tagAt(i, cfg.stats.length), sfx: "tick", vol: 0.18 })),
];

/** Big real numbers from the repo: 3D-flipping glass tiles with gradient counters + a tech tag row. */
export const Stats: React.FC<{ cfg: StatsScene; index: string }> = ({ cfg, index }) => {
  const f = useCurrentFrame();
  const stats = cfg.stats.slice(0, 6);
  const cols = stats.length <= 3 ? stats.length : stats.length === 4 ? 2 : 3;
  const rows = Math.ceil(stats.length / cols);
  const TW = cols === 2 ? 700 : 480;
  const TH = rows === 1 ? 300 : 220;
  const GAP = 36;
  const X0 = (1920 - (cols * TW + (cols - 1) * GAP)) / 2;
  const Y0 = rows === 1 ? 400 : 330;

  return (
    <AbsoluteFill>
      <Header index={index} eyebrow={cfg.eyebrow} inline={cfg.title} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        {stats.map((s, i) => {
          const col = tone(s.tone, i);
          const a = sp(f, tileAt(i), { damping: 14, stiffness: 110 });
          const x = X0 + (i % cols) * (TW + GAP);
          const y = Y0 + Math.floor(i / cols) * (TH + GAP);
          const sweep = interpolate(f, [tileAt(i) + 70, tileAt(i) + 120], [-30, 130], clamp);
          return (
            <div
              key={i}
              style={{
                ...cardStyle(col, { radius: 28 }),
                position: "absolute",
                left: x,
                top: y,
                width: TW,
                height: TH,
                padding: "30px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transform: `rotateX(${(1 - a) * 70}deg) translateY(${(1 - a) * 60}px)`,
                transformOrigin: "50% 100%",
                opacity: Math.min(1, a * 1.4),
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: rows === 1 ? 120 : 96,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  backgroundImage: `linear-gradient(95deg, ${mix(col, "#ffffff", 0.55)}, ${col})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: `drop-shadow(0 0 24px ${alpha(col, 0.35)})`,
                  whiteSpace: "nowrap",
                }}
              >
                <Counter to={s.value} start={tileAt(i) + 6} end={tileAt(i) + 90} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div style={{ marginTop: 14, fontSize: 28, fontWeight: 600, color: C.sub, whiteSpace: "nowrap" }}>{s.label}</div>
              <div style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: `${ease(f, tileAt(i) + 10, tileAt(i) + 90) * 100}%`, background: col, boxShadow: `0 0 16px ${col}` }} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 14}%, rgba(255,255,255,0.12) ${sweep}%, transparent ${sweep + 14}%)` }} />
            </div>
          );
        })}
      </AbsoluteFill>
      {cfg.tags ? (
        <div style={{ position: "absolute", top: Y0 + rows * (TH + GAP) + 30, width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, padding: "0 160px", boxSizing: "border-box" }}>
          {cfg.tags.slice(0, 10).map((t, i) => {
            const a = sp(f, tagAt(i, stats.length), { damping: 12, stiffness: 200 });
            return (
              <div
                key={t}
                style={{
                  fontFamily: MONO,
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.ink,
                  padding: "10px 20px",
                  borderRadius: 12,
                  background: alpha(C.soft, 0.1),
                  border: `1.5px solid ${alpha(C.soft, 0.35)}`,
                  transform: `scale(${a})`,
                  opacity: Math.min(1, a),
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
