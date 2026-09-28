import React from "react";
import { Img, staticFile } from "remotion";
import { STORY } from "../story";
import { C, SANS, mix } from "../theme";

const B = STORY.brand;

/** Aspect ratio of whatever the Logo component renders (image or wordmark estimate). */
export const logoAspect = () => (B.logo ? B.logoAspect ?? 4 : Math.max(2.2, B.name.length * 0.62));

/** Brand logo at a given width; falls back to a gradient wordmark when the repo has no usable logo. */
export const Logo: React.FC<{ width: number; style?: React.CSSProperties; shine?: number }> = ({ width, style, shine }) => {
  const height = width / logoAspect();
  const shineLayer =
    shine !== undefined
      ? `linear-gradient(105deg, transparent ${shine - 12}%, rgba(255,255,255,0.95) ${shine}%, transparent ${shine + 12}%)`
      : undefined;

  if (B.logo) {
    const src = staticFile(B.logo);
    return (
      <div style={{ position: "relative", width, height, ...style }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        {shineLayer ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              background: shineLayer,
            }}
          />
        ) : null}
      </div>
    );
  }

  // Wordmark fallback: one element so background-clip:text keeps a continuous gradient.
  const fontSize = height * 0.82;
  return (
    <div style={{ position: "relative", width, height, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize,
          letterSpacing: "-0.045em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          backgroundImage: [shineLayer, `linear-gradient(95deg, ${mix(C.gradA, "#ffffff", 0.2)}, ${C.gradB})`].filter(Boolean).join(","),
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {B.name}
      </div>
    </div>
  );
};

/** Square brand mark: icon image, or a monogram tile. */
export const BrandMark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  if (B.icon) return <Img src={staticFile(B.icon)} style={{ width: size, height: size, objectFit: "contain", ...style }} />;
  const initials = B.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(135deg, ${C.gradA}, ${C.gradB})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size * 0.46,
        letterSpacing: "-0.04em",
        color: "#fff",
        ...style,
      }}
    >
      {initials}
    </div>
  );
};
