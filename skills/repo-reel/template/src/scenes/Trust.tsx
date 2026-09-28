import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";
import { C, MONO, SANS, alpha, mix, tone } from "../theme";
import { clamp, ease, sp } from "../anim";
import type { Cue, TrustScene } from "../types";
import { Header } from "../components/Text";
import { Icon, IconBadge } from "../components/Icon";
import { Pill, cardStyle } from "../components/Glass";

const digitAt = (i: number) => 64 + i * 9;
const featureAt = (i: number, hasCode: boolean) => (hasCode ? 150 : 90) + i * 14;
export const trustDur = 360;
export const trustCues = (cfg: TrustScene): Cue[] => {
  const n = cfg.code ? cfg.code.digits.length : 0;
  return [
    { at: 16, sfx: "whoosh", vol: 0.35 },
    ...new Array(n).fill(0).map((_, i): Cue => ({ at: digitAt(i), sfx: "key", vol: 0.45 })),
    ...(cfg.code ? [{ at: digitAt(n - 1) + 10, sfx: "chime", vol: 0.55 } as Cue] : [{ at: 128, sfx: "chime", vol: 0.5 } as Cue]),
    ...cfg.features.map((_, i): Cue => ({ at: featureAt(i, !!cfg.code), sfx: "tick", vol: 0.25 })),
  ];
};

const SHIELD = "M50 4 L92 18 L92 50 C92 78 74 96 50 106 C26 96 8 78 8 50 L8 18 Z";
const CHECK = "M30 56 L45 71 L72 42";
const S = 4.4;
const SCX = 560;
const SCY = 610;

const Hexes: React.FC<{ f: number }> = ({ f }) => {
  const cells: React.ReactNode[] = [];
  const r = 34;
  for (let row = -5; row <= 5; row++) {
    for (let col = -6; col <= 6; col++) {
      const x = col * r * 1.75 + (row % 2 ? r * 0.875 : 0);
      const y = row * r * 1.5;
      const d = Math.hypot(x, y);
      const wave = Math.max(0, Math.sin(d / 60 - f / 12));
      const pts = new Array(6)
        .fill(0)
        .map((_, k) => {
          const a = (Math.PI / 3) * k + Math.PI / 6;
          return `${x + Math.cos(a) * r * 0.92},${y + Math.sin(a) * r * 0.92}`;
        })
        .join(" ");
      cells.push(<polygon key={`${row}-${col}`} points={pts} fill="none" stroke={C.soft} strokeWidth={1.5} opacity={(0.05 + wave * 0.18) * Math.max(0, 1 - d / 420)} />);
    }
  }
  return <g transform={`translate(${SCX} ${SCY}) rotate(${f * 0.05})`}>{cells}</g>;
};

/** Shield assembles from shards + draws its check; optional 2FA code types itself; security features slide in. */
export const Trust: React.FC<{ cfg: TrustScene; index: string }> = ({ cfg, index }) => {
  const f = useCurrentFrame();
  const outline = evolvePath(ease(f, 16, 80, Easing.inOut(Easing.cubic)), SHIELD);
  const check = evolvePath(ease(f, 100, 128), CHECK);
  const ring = ((f - 110) % 70) / 70;
  const code = cfg.code;
  const verifiedAt = code ? digitAt(code.digits.length - 1) + 10 : 0;
  const verified = !!code && f >= verifiedAt;
  const featTop = code ? 540 : 330;

  return (
    <AbsoluteFill>
      <Header index={index} eyebrow={cfg.eyebrow} inline={cfg.title} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="shf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.gradA} stopOpacity="0.55" />
            <stop offset="1" stopColor={C.gradB} stopOpacity="0.25" />
          </linearGradient>
          <filter id="shglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <Hexes f={f} />
        {f > 110 ? <circle cx={SCX} cy={SCY} r={260 + ring * 200} fill="none" stroke={C.soft} strokeWidth={2} opacity={(1 - ring) * 0.5} /> : null}
        {new Array(22).fill(0).map((_, i) => {
          const p = interpolate(f, [6 + i * 1.5, 60 + i * 1.5], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
          if (p >= 1) return null;
          const ang = random(`sa${i}`) * Math.PI * 2;
          const dist = 500 + random(`sd${i}`) * 500;
          const s = 18 + random(`ss${i}`) * 26;
          return (
            <polygon
              key={i}
              points={`0,${-s} ${s * 0.8},${s * 0.6} ${-s * 0.8},${s * 0.6}`}
              transform={`translate(${SCX + Math.cos(ang) * dist * (1 - p)} ${SCY + Math.sin(ang) * dist * (1 - p) * 0.8}) rotate(${random(`sr${i}`) * 360 * (1 - p) + f * 2})`}
              fill={i % 2 ? C.soft : C.gradB}
              opacity={Math.min(1, p * 3) * (1 - p) * 0.9}
            />
          );
        })}
        <g transform={`translate(${SCX - 50 * S} ${SCY - 55 * S}) scale(${S})`}>
          <path d={SHIELD} fill="url(#shf)" opacity={ease(f, 70, 110)} />
          <path d={SHIELD} fill="none" stroke={C.soft} strokeWidth={5 / S} opacity={0.8} filter="url(#shglow)" strokeDasharray={outline.strokeDasharray} strokeDashoffset={outline.strokeDashoffset} />
          <path d={SHIELD} fill="none" stroke={mix(C.soft, "#ffffff", 0.8)} strokeWidth={3 / S} strokeLinejoin="round" strokeDasharray={outline.strokeDasharray} strokeDashoffset={outline.strokeDashoffset} />
          <path d={CHECK} fill="none" stroke="#fff" strokeWidth={9 / S} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={check.strokeDasharray} strokeDashoffset={check.strokeDashoffset} />
        </g>
      </svg>

      {code ? (
        <div style={{ position: "absolute", left: 1060, top: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: ease(f, 40, 60) }}>
            <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>{code.label}</div>
            {code.meta ? <div style={{ fontFamily: MONO, fontSize: 18, color: C.muted, letterSpacing: "0.2em" }}>{code.meta}</div> : null}
            <div style={{ transform: `scale(${sp(f, verifiedAt, { damping: 10, stiffness: 220 })})` }}>
              <Pill color={C.soft} size={18}>
                {code.verified ?? "VERIFIED"}
              </Pill>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
            {code.digits.split("").map((d, i) => {
              const typed = f >= digitAt(i);
              const box = sp(f, 36 + i * 4, { damping: 16, stiffness: 160 });
              const caret = !typed && (i === 0 ? f >= 50 : f >= digitAt(i - 1)) && Math.floor(f / 15) % 2 === 0;
              const col = verified ? C.soft : typed ? C.gradB : "rgba(255,255,255,0.18)";
              return (
                <div
                  key={i}
                  style={{
                    width: 96,
                    height: 118,
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: verified ? alpha(C.soft, 0.1) : "rgba(255,255,255,0.05)",
                    border: `2px solid ${col}`,
                    boxShadow: typed ? `0 0 30px ${alpha(verified ? C.soft : C.gradB, 0.25)}` : undefined,
                    fontFamily: MONO,
                    fontSize: 60,
                    fontWeight: 700,
                    color: C.ink,
                    transform: `translateY(${(1 - box) * 40}px)`,
                    opacity: Math.min(1, box),
                  }}
                >
                  {typed ? <span style={{ display: "inline-block", transform: `scale(${sp(f, digitAt(i), { damping: 10, stiffness: 260 })})` }}>{d}</span> : null}
                  {caret ? <div style={{ width: 3, height: 56, background: C.gradB }} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 1060, top: featTop, display: "flex", flexDirection: "column", gap: 18 }}>
        {cfg.features.slice(0, code ? 4 : 6).map((ft, i) => {
          const at = featureAt(i, !!code);
          const a = sp(f, at, { damping: 16, stiffness: 150 });
          const col = tone(ft.tone, i);
          return (
            <div
              key={ft.title}
              style={{
                ...cardStyle(undefined, { radius: 22 }),
                width: 700,
                height: 100,
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                transform: `translateX(${(1 - a) * 160}px)`,
                opacity: Math.min(1, a * 1.3),
              }}
            >
              <IconBadge name={ft.icon} color={col} size={58} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 29, fontWeight: 750, whiteSpace: "nowrap" }}>{ft.title}</div>
                <div style={{ fontSize: 20, color: C.muted, marginTop: 3, whiteSpace: "nowrap" }}>{ft.sub}</div>
              </div>
              <Icon name="check" size={30} color={C.soft} stroke={3} style={{ opacity: ease(f, at + 14, at + 24) }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
