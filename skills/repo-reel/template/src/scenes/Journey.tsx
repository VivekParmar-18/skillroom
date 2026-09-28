import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { evolvePath, getLength } from "@remotion/paths";
import { C, GRAD_MID, MONO, alpha, tone } from "../theme";
import { clamp, ease, pointAt, sp } from "../anim";
import type { Cue, JourneyScene } from "../types";
import { Header } from "../components/Text";
import { cardStyle } from "../components/Glass";
import { Icon, IconBadge } from "../components/Icon";

const DRAW_START = 60;
const DRAW_END = 470;
export const journeyDur = 600;
const drawProgress = (f: number) => interpolate(f, [DRAW_START, DRAW_END], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0.05, 0.4, 1) });

/** Wave through the stage points (alternating crest/trough) as a Catmull-Rom → cubic Bézier path. */
const geometry = (n: number) => {
  const x0 = 300, x1 = 1700;
  const pts = new Array(n).fill(0).map((_, i) => ({ x: n === 1 ? 960 : x0 + ((x1 - x0) * i) / (n - 1), y: i % 2 === 0 ? 735 : 545 }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  const lens = [0];
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
    lens.push(getLength(d));
  }
  const len = lens[lens.length - 1] || 1;
  return { d, pts, len, fracs: lens.map((l) => l / len) };
};

const nodeFrames = (fracs: number[]) =>
  fracs.map((fr) => {
    for (let f = DRAW_START; f <= DRAW_END; f++) if (drawProgress(f) >= Math.max(0.005, fr - 0.002)) return f;
    return DRAW_END;
  });

export const journeyCues = (cfg: JourneyScene): Cue[] => {
  const frames = nodeFrames(geometry(cfg.stages.length).fracs);
  return [
    { at: 56, sfx: "whoosh", vol: 0.35 },
    ...frames.map((at, i): Cue => (i === frames.length - 1 ? { at, sfx: "chime", vol: 0.55 } : { at, sfx: "pop", vol: 0.45 })),
  ];
};

/** A glowing path draws itself through lifecycle stages; a comet rides the tip, nodes pop, cards rise. */
export const Journey: React.FC<{ cfg: JourneyScene; index: string }> = ({ cfg, index }) => {
  const f = useCurrentFrame();
  const { d: PATH, pts, len: LEN, fracs } = React.useMemo(() => geometry(cfg.stages.length), [cfg.stages.length]);
  const frames = React.useMemo(() => nodeFrames(fracs), [fracs]);
  const p = drawProgress(f);
  const head = pointAt(PATH, Math.max(0.01, p * LEN));
  const evo = evolvePath(p, PATH);
  const intro = sp(f, 0, { damping: 22, stiffness: 60 });

  return (
    <AbsoluteFill>
      <Header index={index} eyebrow={cfg.eyebrow} lines={cfg.title} size={78} />
      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "50% 40%" }}>
        <AbsoluteFill
          style={{
            transform: `translateX(${interpolate(p, [0, 1], [50, -40])}px) translateY(${(1 - intro) * 120 + 40}px) rotateX(${interpolate(f, [0, journeyDur], [20, 9])}deg) rotateY(${interpolate(
              f,
              [0, journeyDur],
              [-4, 5],
            )}deg)`,
            transformOrigin: "50% 65%",
            opacity: intro,
          }}
        >
          <svg width={1920} height={1080} style={{ position: "absolute", overflow: "visible" }}>
            <defs>
              <linearGradient id="jg" gradientUnits="userSpaceOnUse" x1="300" y1="0" x2="1700" y2="0">
                <stop offset="0" stopColor={C.gradA} />
                <stop offset="0.5" stopColor={GRAD_MID} />
                <stop offset="1" stopColor={C.gradB} />
              </linearGradient>
              <filter id="jglow" x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>
            <path d={PATH} stroke="rgba(255,255,255,0.09)" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="2 16" />
            <path d={PATH} stroke="url(#jg)" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.55} filter="url(#jglow)" strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset} />
            <path d={PATH} stroke="url(#jg)" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset} />
            {p > 0 && p < 1
              ? new Array(16).fill(0).map((_, k) => {
                  const pt = pointAt(PATH, Math.max(0, p * LEN - k * 9));
                  return <circle key={k} cx={pt.x} cy={pt.y} r={12 - k * 0.6} fill={C.glow} opacity={(1 - k / 16) * 0.5} />;
                })
              : null}
            {cfg.stages.map((s, i) => {
              const pt = pts[i];
              const col = tone(s.tone, i);
              const act = sp(f, frames[i], { damping: 12, stiffness: 180 });
              const ring = ease(f, frames[i], frames[i] + 40, Easing.out(Easing.cubic));
              const isLast = i === cfg.stages.length - 1;
              const radar = isLast && f > frames[i] ? ((f - frames[i]) % 50) / 50 : 0;
              return (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r={11} fill={C.panel} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
                  {ring > 0 && ring < 1 ? <circle cx={pt.x} cy={pt.y} r={26 + ring * 70} fill="none" stroke={col} strokeWidth={3} opacity={(1 - ring) * 0.8} /> : null}
                  {radar > 0
                    ? [radar, (radar + 0.5) % 1].map((r, k) => <circle key={k} cx={pt.x} cy={pt.y} r={30 + r * 90} fill="none" stroke={col} strokeWidth={2} opacity={(1 - r) * 0.6} />)
                    : null}
                  <g transform={`translate(${pt.x} ${pt.y}) scale(${act})`}>
                    <circle r={30} fill={C.panel} stroke={col} strokeWidth={4} />
                    <circle r={30} fill={col} opacity={0.18} />
                    <circle r={11} fill={col} />
                  </g>
                </g>
              );
            })}
            {p > 0 && p < 1 ? (
              <g>
                <circle cx={head.x} cy={head.y} r={46} fill={C.gradB} opacity={0.25} filter="url(#jglow)" />
                <circle cx={head.x} cy={head.y} r={13} fill="#fff" />
              </g>
            ) : null}
          </svg>

          {cfg.stages.map((s, i) => {
            const pt = pts[i];
            const col = tone(s.tone, i);
            const a = sp(f, frames[i] + 4, { damping: 15, stiffness: 150 });
            const above = i % 2 === 1; // crests carry cards above, troughs below
            const cardW = s.badges ? Math.max(360, 70 + s.badges.join("").length * 13 + s.badges.length * 40) : 360;
            const left = Math.min(Math.max(pt.x - cardW / 2, 170), 1920 - cardW - 110);
            return (
              <div
                key={i}
                style={{
                  ...cardStyle(col),
                  position: "absolute",
                  left,
                  top: above ? pt.y - 196 : pt.y + 56,
                  width: cardW,
                  height: 140,
                  opacity: Math.min(1, a),
                  transform: `translateY(${(1 - a) * (above ? 30 : -30)}px) scale(${0.85 + 0.15 * a})`,
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <IconBadge name={s.icon} color={col} size={50} />
                  <div style={{ fontSize: 31, fontWeight: 750, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{s.title}</div>
                </div>
                {s.badges ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    {s.badges.map((b, k) => (
                      <div
                        key={b}
                        style={{
                          fontFamily: MONO,
                          fontSize: 19,
                          fontWeight: 700,
                          padding: "6px 14px",
                          borderRadius: 10,
                          background: alpha(col, 0.16),
                          border: `1px solid ${alpha(col, 0.45)}`,
                          whiteSpace: "nowrap",
                          transform: `scale(${sp(f, frames[i] + 14 + k * 5, { damping: 13, stiffness: 200 })})`,
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                ) : s.status ? (
                  <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 600, color: col, letterSpacing: "0.14em", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
                    {i === cfg.stages.length - 1 ? <Icon name="check" size={20} color={col} stroke={3} /> : null}
                    {s.status}
                  </div>
                ) : null}
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
