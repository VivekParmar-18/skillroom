import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, SANS, alpha, tone } from "../theme";
import { ease, sp } from "../anim";
import type { Cue, OrbitScene } from "../types";
import { Eyebrow, Kinetic } from "../components/Text";
import { IconBadge } from "../components/Icon";
import { Flash } from "../components/Overlays";
import { BrandMark } from "../components/Brand";

const nodeAt = (i: number) => 40 + i * 11;
const CAPTION = 190;
export const orbitDur = 480;
export const orbitCues = (cfg: OrbitScene): Cue[] => [
  ...cfg.nodes.map((_, i): Cue => ({ at: nodeAt(i), sfx: "pop", vol: 0.3 })),
  { at: CAPTION, sfx: "impact", vol: 0.5 },
  { at: CAPTION + 6, sfx: "shimmer", vol: 0.3 },
];

const CX = 960;
const CY = 460;
const RX = 650;
const RY = 245;

/** Product hub with actors orbiting on a tilted 3D ellipse; depth-sorted, far side blurred, pulses along spokes. */
export const Orbit: React.FC<{ cfg: OrbitScene; index: string }> = ({ cfg, index }) => {
  const f = useCurrentFrame();
  const t = f / 60;
  const hub = sp(f, 8, { damping: 13, stiffness: 110 });
  const nodes = cfg.nodes.map((r, i) => {
    const theta = (i / cfg.nodes.length) * Math.PI * 2 + t * 0.22 + Math.PI / 2;
    const out = sp(f, nodeAt(i), { damping: 15, stiffness: 90 });
    const z = Math.sin(theta);
    return {
      ...r,
      i,
      out,
      z,
      color: tone(r.tone, i),
      x: CX + Math.cos(theta) * RX * out,
      y: CY + Math.sin(theta) * RY * out,
      scale: (0.7 + 0.4 * ((z + 1) / 2)) * Math.min(1, out),
    };
  });
  const rot = f * 0.4;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 92, zIndex: 300 }}>
        <Eyebrow index={index} label={cfg.eyebrow} delay={4} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", zIndex: 20 }}>
        <defs>
          <radialGradient id="hubglow">
            <stop offset="0" stopColor={C.primary} stopOpacity="0.55" />
            <stop offset="1" stopColor={C.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY} r={330 * hub} fill="url(#hubglow)" opacity={0.6 + 0.2 * Math.sin(f / 15)} />
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={2} strokeDasharray="4 12" opacity={ease(f, 20, 60)} />
        {nodes.map((n) => {
          const pulse = (((t * 0.7 + n.i * 0.17) % 1) + 1) % 1;
          return (
            <g key={n.i} opacity={Math.min(1, n.out) * (0.45 + 0.55 * ((n.z + 1) / 2))}>
              <line x1={CX} y1={CY} x2={n.x} y2={n.y} stroke={n.color} strokeOpacity={0.35} strokeWidth={2.5} />
              <circle cx={CX + (n.x - CX) * pulse} cy={CY + (n.y - CY) * pulse} r={6} fill="#fff" opacity={Math.sin(pulse * Math.PI)} />
              <circle cx={CX + (n.x - CX) * pulse} cy={CY + (n.y - CY) * pulse} r={16} fill={n.color} opacity={Math.sin(pulse * Math.PI) * 0.3} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: CX, top: CY, width: 0, height: 0, zIndex: 50, transform: `scale(${hub})` }}>
        <svg width={560} height={560} style={{ position: "absolute", left: -280, top: -280 }}>
          <g transform={`rotate(${rot} 280 280)`}>
            <circle cx={280} cy={280} r={180} fill="none" stroke={C.soft} strokeOpacity={0.5} strokeWidth={2.5} strokeDasharray="60 22 8 22" />
          </g>
          <g transform={`rotate(${-rot * 1.6} 280 280)`}>
            <circle cx={280} cy={280} r={215} fill="none" stroke={C.gradB} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="2 10" />
          </g>
          <circle cx={280} cy={280} r={150} fill={alpha(C.bg, 0.75)} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        </svg>
        <BrandMark size={150} style={{ position: "absolute", left: -75, top: -75, filter: `drop-shadow(0 0 30px ${alpha(C.gradB, 0.6)})` }} />
      </div>
      {nodes.map((n) => {
        const blur = Math.max(0, -n.z) * 4;
        return (
          <div
            key={n.i}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              zIndex: n.z > -0.15 ? 100 + Math.round(n.z * 50) : 10,
              transform: `translate(-50%, -50%) scale(${n.scale})`,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              opacity: Math.min(1, n.out * 1.3) * (0.55 + 0.45 * ((n.z + 1) / 2)),
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "16px 30px 16px 16px",
              borderRadius: 999,
              background: `linear-gradient(160deg, ${alpha("#141E26", 0.92)}, ${alpha("#0A1117", 0.88)})`,
              border: `1.5px solid ${alpha(n.color, 0.4)}`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${alpha(n.color, 0.19)}, inset 0 1.5px 0 rgba(255,255,255,0.18)`,
              fontFamily: SANS,
              fontSize: 34,
              fontWeight: 700,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            <IconBadge name={n.icon} color={n.color} size={62} />
            {n.label}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 800, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 300 }}>
        <div style={{ display: "flex", gap: 26 }}>
          <Kinetic text={cfg.caption[0]} delay={CAPTION} stagger={1.4} size={84} gradient />
          <Kinetic text={cfg.caption[1]} delay={CAPTION + 14} stagger={1.1} size={84} />
        </div>
        {cfg.sub ? <Kinetic text={cfg.sub} delay={CAPTION + 50} stagger={0.8} size={40} weight={500} color={C.sub} align="center" letterSpacing={0} /> : null}
      </div>
      <Flash at={CAPTION + 4} strength={0.25} />
      <div style={{ position: "absolute", inset: 0, background: alpha(C.bg, interpolate(f, [0, 20], [0.6, 0], { extrapolateRight: "clamp" })) }} />
    </AbsoluteFill>
  );
};
