import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { C, GRAD_MID, MONO, alpha, tone } from "../theme";
import { ease, sp } from "../anim";
import type { Cue, DashboardScene } from "../types";
import { Counter, Header, Illustrative } from "../components/Text";
import { Bar, Pill, cardStyle } from "../components/Glass";
import { Icon, IconBadge, IconName } from "../components/Icon";
import { BrandMark } from "../components/Brand";

const TOAST_AT = [140, 182, 224, 266];
const SCAN = 290;
const SCAN_DONE = 392;
export const dashboardDur = 480;
export const dashboardCues = (cfg: DashboardScene): Cue[] => [
  { at: 8, sfx: "whoosh", vol: 0.4 },
  ...cfg.toasts.slice(0, 4).map((_, i): Cue => ({ at: TOAST_AT[i], sfx: "pop", vol: 0.45 })),
  ...(cfg.scanCard ? [{ at: SCAN, sfx: "whoosh", vol: 0.3 } as Cue, { at: SCAN_DONE, sfx: "chime", vol: 0.5 } as Cue] : []),
];

const BARS = [0.42, 0.55, 0.48, 0.66, 0.6, 0.74, 0.7, 0.82, 0.78, 0.9, 0.86, 0.97];
const LINE = "M 0 190 C 40 180 60 150 100 155 S 160 120 200 110 S 260 125 300 80 S 360 50 380 30";

const Panel: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ borderRadius: 22, background: "rgba(255,255,255,0.045)", border: "1.5px solid rgba(255,255,255,0.10)", boxSizing: "border-box", padding: 22, ...style }}>{children}</div>
);

/** Tilted 3D product dashboard builds itself; live notifications stack in; optional scanning automation card. */
export const Dashboard: React.FC<{ cfg: DashboardScene; index: string }> = ({ cfg, index }) => {
  const f = useCurrentFrame();
  const enter = sp(f, 6, { damping: 18, stiffness: 70 });
  const line = evolvePath(ease(f, 110, 200), LINE);
  const scan = ease(f, SCAN, SCAN + 95);
  const side: IconName[] = cfg.sidebar ?? ["chart", "package", "users", "receipt", "bell", "cog"];
  const toasts = cfg.toasts.slice(0, 4);

  return (
    <AbsoluteFill>
      <Header index={index} eyebrow={cfg.eyebrow} inline={cfg.title} />

      <div style={{ position: "absolute", left: 120, top: 290, perspective: 2200 }}>
        <div
          style={{
            ...cardStyle(undefined, { radius: 32, solid: true }),
            width: 1180,
            height: 700,
            transform: `translateY(${(1 - enter) * 140}px) rotateY(${interpolate(f, [0, dashboardDur], [-20, -9])}deg) rotateX(${interpolate(f, [0, dashboardDur], [11, 6])}deg)`,
            transformOrigin: "0% 50%",
            opacity: Math.min(1, enter * 1.5),
            boxShadow: `0 60px 140px rgba(0,0,0,0.6), inset 0 1.5px 0 rgba(255,255,255,0.18), 0 0 80px ${alpha(C.primary, 0.12)}`,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <div style={{ width: 96, borderRight: "1.5px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 26, gap: 26 }}>
            <BrandMark size={52} />
            {side.map((ic, i) => (
              <div
                key={ic + i}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: i === 0 ? alpha(C.primary, 0.2) : "transparent",
                  opacity: ease(f, 20 + i * 5, 40 + i * 5),
                }}
              >
                <Icon name={ic} size={26} color={i === 0 ? C.soft : C.muted} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: 30, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", gap: 18 }}>
              {cfg.kpis.slice(0, 4).map((k, i) => {
                const a = sp(f, 34 + i * 8, { damping: 15, stiffness: 150 });
                const col = tone(k.tone, i);
                return (
                  <Panel key={k.label} style={{ flex: 1, height: 150, transform: `translateY(${(1 - a) * 40}px)`, opacity: Math.min(1, a), position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: 20, color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>{k.label}</div>
                    <Counter to={k.value} start={45 + i * 8} end={130 + i * 8} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} style={{ display: "block", marginTop: 10, fontSize: 50, fontWeight: 800, letterSpacing: "-0.02em" }} />
                    <div style={{ position: "absolute", right: 20, top: 22, width: 12, height: 12, borderRadius: 12, background: col, boxShadow: `0 0 14px ${col}` }} />
                    <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${ease(f, 60 + i * 8, 140 + i * 8) * 100}%`, background: col, boxShadow: `0 0 12px ${col}` }} />
                  </Panel>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 18, flex: 1 }}>
              <Panel style={{ flex: 1.45, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{cfg.barsTitle}</div>
                  <Bar w={110} h={12} />
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 14, paddingTop: 20, borderBottom: "1.5px solid rgba(255,255,255,0.1)" }}>
                  {BARS.map((h, i) => {
                    const g = sp(f, 70 + i * 4, { damping: 14, stiffness: 120 });
                    const last = i === BARS.length - 1;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${h * 100 * g}%`,
                          borderRadius: "10px 10px 4px 4px",
                          background: `linear-gradient(to top, ${C.deep}, ${last ? C.soft : GRAD_MID})`,
                          boxShadow: last ? `0 0 24px ${C.soft}` : undefined,
                          opacity: last ? 1 : 0.8,
                        }}
                      />
                    );
                  })}
                </div>
              </Panel>
              <Panel style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{cfg.lineTitle}</div>
                <svg viewBox="0 0 380 210" style={{ flex: 1, marginTop: 14, overflow: "visible" }}>
                  <defs>
                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={C.gradB} stopOpacity="0.4" />
                      <stop offset="1" stopColor={C.gradB} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${LINE} L 380 210 L 0 210 Z`} fill="url(#area)" opacity={ease(f, 170, 220)} />
                  <path d={LINE} stroke={C.gradB} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={line.strokeDasharray} strokeDashoffset={line.strokeDashoffset} />
                  <circle cx={380} cy={30} r={8 + Math.sin(f / 8) * 2} fill={C.gradB} opacity={ease(f, 195, 205)} />
                  <circle cx={380} cy={30} r={22} fill={C.gradB} opacity={ease(f, 195, 205) * 0.25} />
                </svg>
              </Panel>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 1400, top: 262, display: "flex", alignItems: "center", gap: 12, opacity: ease(f, 118, 138) }}>
        <div style={{ width: 12, height: 12, borderRadius: 12, background: C.danger, boxShadow: `0 0 ${10 + 6 * Math.sin(f / 6)}px ${C.danger}` }} />
        <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.sub, letterSpacing: "0.25em" }}>LIVE</div>
      </div>
      {toasts.map((t, i) => {
        const col = tone(t.tone, i);
        const a = sp(f, TOAST_AT[i], { damping: 16, stiffness: 150 });
        const newer = TOAST_AT.slice(i + 1, toasts.length).reduce((acc, at) => acc + sp(f, at, { damping: 18, stiffness: 140 }), 0);
        return (
          <div
            key={i}
            style={{
              ...cardStyle(col, { radius: 20, solid: true }),
              position: "absolute",
              left: 1400,
              top: 306 + newer * 108,
              width: 420,
              height: 94,
              transform: `translateX(${(1 - a) * 500}px)`,
              opacity: Math.min(1, a * 1.3),
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <IconBadge name={t.icon} color={col} size={54} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 25, fontWeight: 750, whiteSpace: "nowrap" }}>{t.title}</div>
              <div style={{ fontSize: 19, color: C.muted, marginTop: 2, whiteSpace: "nowrap" }}>{t.sub}</div>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 15, color: C.dim }}>now</div>
          </div>
        );
      })}

      {cfg.scanCard
        ? (() => {
            const a = sp(f, SCAN - 30, { damping: 16, stiffness: 120 });
            const done = sp(f, SCAN_DONE, { damping: 10, stiffness: 200 });
            const lines = [0.9, 0.75, 0.85, 0.6, 0.8, 0.5];
            return (
              <div
                style={{
                  ...cardStyle(C.violet, { radius: 22, solid: true }),
                  position: "absolute",
                  left: 1400,
                  top: 752,
                  width: 420,
                  height: 250,
                  padding: 22,
                  transform: `translateY(${(1 - a) * 80}px)`,
                  opacity: Math.min(1, a),
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon name="spark" size={28} color={C.violet} />
                    <div style={{ fontSize: 24, fontWeight: 750, whiteSpace: "nowrap" }}>{cfg.scanCard.title}</div>
                  </div>
                  <div style={{ transform: `scale(${done})`, opacity: Math.min(1, done) }}>
                    <Pill color={C.soft} size={17}>
                      {cfg.scanCard.done}
                    </Pill>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 13 }}>
                  {lines.map((w, i) => (
                    <Bar key={i} w={`${w * 100}%`} h={12} color={scan > (i + 0.5) / lines.length ? alpha(C.soft, 0.5) : "rgba(255,255,255,0.13)"} />
                  ))}
                </div>
                {scan > 0 && scan < 1 ? (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 64 + scan * 170,
                        height: 3,
                        background: `linear-gradient(90deg, transparent, ${C.violet}, #fff, ${C.violet}, transparent)`,
                        boxShadow: `0 0 20px ${C.violet}, 0 0 40px ${C.violet}`,
                      }}
                    />
                    <div style={{ position: "absolute", left: 0, right: 0, top: 64, height: scan * 170, background: `linear-gradient(to bottom, ${alpha(C.violet, 0)}, ${alpha(C.violet, 0.12)})` }} />
                  </>
                ) : null}
              </div>
            );
          })()
        : null}
      {cfg.illustrative !== false ? <Illustrative /> : null}
    </AbsoluteFill>
  );
};
