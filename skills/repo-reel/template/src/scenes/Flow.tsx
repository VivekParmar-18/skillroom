import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { evolvePath, getLength } from "@remotion/paths";
import { C, MONO, alpha, tone } from "../theme";
import { ease, lerp, pointAt, sp } from "../anim";
import type { Cue, FlowScene } from "../types";
import { Counter, Header, Illustrative, Kinetic } from "../components/Text";
import { Bar, Pill, cardStyle } from "../components/Glass";
import { Icon } from "../components/Icon";
import { BrandMark } from "../components/Brand";

const RIBBONS = 300;
const destAt = (i: number) => 338 + i * 14;
export const flowDur = 480;

const stateFrames = (n: number) => {
  // first state at 0, the rest spread from frame 175 to the "done" frame 265
  if (n <= 1) return [0];
  return new Array(n).fill(0).map((_, i) => (i === 0 ? 0 : Math.round(175 + ((265 - 175) * (i - 1)) / Math.max(1, n - 2))));
};

export const flowCues = (cfg: FlowScene): Cue[] => {
  const sf = stateFrames(cfg.doc.states.length);
  const done = sf[sf.length - 1];
  return [
    { at: 18, sfx: "whoosh", vol: 0.45 },
    ...sf.slice(1, -1).map((at): Cue => ({ at, sfx: "tick", vol: 0.4 })),
    { at: done, sfx: "impact", vol: 0.45 },
    { at: done, sfx: "chime", vol: 0.55 },
    { at: RIBBONS, sfx: "whoosh", vol: 0.4 },
    ...cfg.destinations.map((_, i): Cue => ({ at: destAt(i), sfx: "pop", vol: 0.4 })),
  ];
};

const START = { x: 720, y: 812 };

/** A document flips in and progresses through states (stamp + confetti), then value fans out along ribbons to recipients. */
export const Flow: React.FC<{ cfg: FlowScene; index: string }> = ({ cfg, index }) => {
  const f = useCurrentFrame();
  const { doc } = cfg;
  const sf = stateFrames(doc.states.length);
  const DONE = sf[sf.length - 1];
  const stIdx = sf.reduce((acc, at, i) => (f >= at ? i : acc), 0);
  const st = doc.states[stIdx];
  const stCol = tone(st.tone);
  const stPop = sp(f, sf[stIdx], { damping: 9, stiffness: 220 });
  const flip = sp(f, 18, { damping: 17, stiffness: 70 });
  const idle = Math.sin(f / 50) * 2;
  const progress = doc.states.length <= 1 ? 1 : stIdx / (doc.states.length - 1);
  const prevProgress = doc.states.length <= 1 ? 1 : Math.max(0, stIdx - 1) / (doc.states.length - 1);
  const frac = stIdx === 0 ? 0 : lerp(prevProgress, progress, ease(f, sf[stIdx], sf[stIdx] + 30));
  const stamp = sp(f, DONE, { damping: 11, stiffness: 240, mass: 0.8 });
  const n = cfg.destinations.length;
  const destY = (i: number) => 540 + (i - (n - 1) / 2) * 230;
  const ribbon = (y: number) => `M ${START.x} ${START.y} C 1010 ${START.y} 1050 ${y} 1330 ${y}`;

  return (
    <AbsoluteFill>
      <Header index={index} eyebrow={cfg.eyebrow} inline={cfg.title} />

      <div style={{ position: "absolute", left: 150, top: 290, perspective: 1600 }}>
        <div
          style={{
            ...cardStyle(undefined, { radius: 32 }),
            width: 570,
            height: 690,
            padding: 40,
            transform: `rotateY(${interpolate(flip, [0, 1], [-100, -8]) + idle}deg) rotateX(${4 + idle * 0.5}deg)`,
            transformOrigin: "30% 50%",
            opacity: Math.min(1, flip * 2),
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 40px 100px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,0.25), 0 0 ${80 * ease(f, DONE, DONE + 20)}px ${alpha(C.primary, 0.35)}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <BrandMark size={58} />
              <div>
                <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.3em", color: C.muted }}>{doc.kicker}</div>
                <div style={{ fontSize: 28, fontWeight: 750 }}>{doc.id}</div>
              </div>
            </div>
            <div style={{ transform: `scale(${stPop})` }}>
              <Pill color={stCol} size={22}>
                {st.label}
              </Pill>
            </div>
          </div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 12 }}>
            <Bar w={120} h={12} color="rgba(255,255,255,0.22)" />
            <Bar w={260} h={12} />
          </div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
            {doc.items.slice(0, 5).map((amt, i) => {
              const a = ease(f, 50 + i * 9, 70 + i * 9);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: a, transform: `translateX(${(1 - a) * 30}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: alpha(C.soft, 0.14), border: `1px solid ${alpha(C.soft, 0.35)}` }} />
                    <Bar w={(150 + random(`w${i}`) * 110) * a} h={14} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 22, color: C.sub }}>{amt}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 34, height: 1.5, background: "rgba(255,255,255,0.14)" }} />
          <div style={{ marginTop: 22, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div style={{ fontSize: 24, color: C.muted, fontWeight: 600 }}>{doc.totalLabel}</div>
            <Counter to={doc.total} start={80} end={150} decimals={doc.decimals ?? 2} prefix={doc.prefix ?? ""} style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.02em" }} />
          </div>
          <div style={{ marginTop: 16, height: 12, borderRadius: 12, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ width: `${frac * 100}%`, height: "100%", borderRadius: 12, background: stCol, boxShadow: `0 0 20px ${stCol}` }} />
          </div>
          {doc.methods ? (
            <div style={{ marginTop: 26, display: "flex", gap: 14 }}>
              {doc.methods.slice(0, 2).map((m, i) => {
                const a = sp(f, 120 + i * 14, { damping: 13, stiffness: 180 });
                const active = f >= sf[Math.min(sf.length - 1, i + 1)];
                return (
                  <div
                    key={m.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 20px",
                      whiteSpace: "nowrap",
                      borderRadius: 16,
                      fontSize: 22,
                      fontWeight: 650,
                      background: active ? alpha(C.soft, 0.14) : "rgba(255,255,255,0.06)",
                      border: `1.5px solid ${active ? alpha(C.soft, 0.55) : "rgba(255,255,255,0.14)"}`,
                      transform: `scale(${a})`,
                      opacity: Math.min(1, a),
                    }}
                  >
                    <Icon name={m.icon} size={26} color={active ? C.soft : C.sub} />
                    {m.label}
                    {active ? <Icon name="check" size={22} color={C.soft} stroke={3} /> : null}
                  </div>
                );
              })}
            </div>
          ) : null}
          {doc.stamp && f >= DONE ? (
            <div
              style={{
                position: "absolute",
                right: 40,
                top: 230,
                transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [2.6, 1])})`,
                opacity: Math.min(1, stamp * 1.4) * 0.92,
                border: `6px solid ${C.soft}`,
                borderRadius: 18,
                padding: "6px 26px",
                fontWeight: 900,
                fontSize: 84,
                letterSpacing: "0.08em",
                color: C.soft,
                textShadow: `0 0 30px ${C.primary}`,
                boxShadow: `0 0 40px ${alpha(C.primary, 0.5)}, inset 0 0 30px ${alpha(C.primary, 0.35)}`,
                whiteSpace: "nowrap",
              }}
            >
              {doc.stamp}
            </div>
          ) : null}
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", pointerEvents: "none" }}>
        {f >= DONE && f < DONE + 50
          ? new Array(36).fill(0).map((_, i) => {
              const t = (f - DONE) / 50;
              const ang = random(`ca${i}`) * Math.PI * 2;
              const dist = (120 + random(`cd${i}`) * 260) * (1 - Math.pow(1 - t, 3));
              return (
                <circle key={i} cx={590 + Math.cos(ang) * dist} cy={580 + Math.sin(ang) * dist + t * t * 120} r={3 + random(`cr${i}`) * 5} fill={i % 3 ? C.soft : C.gradB} opacity={1 - t} />
              );
            })
          : null}
      </svg>

      <div style={{ position: "absolute", left: 790, top: 300 }}>
        <Kinetic text={cfg.flowLabel} delay={RIBBONS - 20} stagger={0.8} size={34} weight={600} color={C.sub} letterSpacing={0} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          {cfg.destinations.map((d, i) => (
            <linearGradient key={i} id={`rb${i}`} gradientUnits="userSpaceOnUse" x1={START.x} y1="0" x2="1330" y2="0">
              <stop offset="0" stopColor={C.soft} stopOpacity="0.9" />
              <stop offset="1" stopColor={tone(d.tone, i)} />
            </linearGradient>
          ))}
          <filter id="rglow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {cfg.destinations.map((d, i) => {
          const path = ribbon(destY(i));
          const len = getLength(path);
          const pr = ease(f, RIBBONS + i * 12, RIBBONS + 50 + i * 12);
          const evo = evolvePath(pr, path);
          return (
            <g key={i}>
              <path d={path} stroke={`url(#rb${i})`} strokeWidth={24} fill="none" opacity={0.4} filter="url(#rglow)" strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset} />
              <path d={path} stroke={`url(#rb${i})`} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={evo.strokeDasharray} strokeDashoffset={evo.strokeDashoffset} />
              {pr >= 1
                ? new Array(5).fill(0).map((_, k) => {
                    const u = ((((f - RIBBONS - 60) / 70 + k / 5) % 1) + 1) % 1;
                    const pt = pointAt(path, u * len);
                    return <circle key={k} cx={pt.x} cy={pt.y} r={7} fill="#fff" opacity={Math.sin(u * Math.PI)} />;
                  })
                : null}
            </g>
          );
        })}
        <circle cx={START.x} cy={START.y} r={14 * ease(f, RIBBONS - 10, RIBBONS)} fill={C.soft} />
      </svg>

      {cfg.destinations.map((d, i) => {
        const col = tone(d.tone, i);
        const a = sp(f, destAt(i), { damping: 14, stiffness: 160 });
        const badge = sp(f, destAt(i) + 50, { damping: 10, stiffness: 220 });
        return (
          <div
            key={i}
            style={{
              ...cardStyle(col, { radius: 26 }),
              position: "absolute",
              left: 1330,
              top: destY(i) - 85,
              width: 460,
              height: 170,
              padding: "0 30px 0 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: Math.min(1, a),
              transform: `translateX(${(1 - a) * 80}px) scale(${0.9 + 0.1 * a})`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 24, bottom: 24, width: 6, borderRadius: 6, background: col, boxShadow: `0 0 16px ${col}` }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 40, fontWeight: 800, whiteSpace: "nowrap" }}>{d.label}</div>
              <div style={{ fontSize: 21, color: C.muted, marginTop: 4, whiteSpace: "nowrap" }}>{d.sub}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              {d.amount !== undefined ? (
                <Counter to={d.amount} start={destAt(i)} end={destAt(i) + 50} decimals={doc.decimals ?? 2} prefix={doc.prefix ?? ""} style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: col }} />
              ) : null}
              {d.badge ? (
                <div style={{ transform: `scale(${badge})`, opacity: Math.min(1, badge) }}>
                  <Pill color={C.soft} size={18}>
                    {d.badge}
                  </Pill>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      {cfg.illustrative !== false ? <Illustrative style={{ top: undefined, bottom: 34, right: 60 }} /> : null}
    </AbsoluteFill>
  );
};

