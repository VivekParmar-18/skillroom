import React from "react";
import { Composition } from "remotion";
import { Video, TOTAL } from "./Video";
import { FPS, H, W } from "./theme";

export const Root: React.FC = () => (
  <Composition id="Main" component={Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
