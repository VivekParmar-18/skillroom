import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type ZoomProps = { strength?: number; blur?: number };

/** CSS zoom-through: outgoing scene rushes toward camera and blurs out, incoming settles in from behind. */
const ZoomThrough: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const strength = passedProps.strength ?? 0.35;
  const blur = passedProps.blur ?? 24;
  const entering = presentationDirection === "entering";
  const scale = entering ? 1 - strength * 0.5 * (1 - p) : 1 + strength * p;
  const b = entering ? blur * (1 - p) : blur * p;
  const opacity = entering ? Math.min(1, p * 1.6) : 1 - Math.max(0, (p - 0.2) / 0.8);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        filter: b > 0.3 ? `blur(${b}px)` : undefined,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoomThrough = (props: ZoomProps = {}): TransitionPresentation<ZoomProps> => ({
  component: ZoomThrough,
  props,
});
