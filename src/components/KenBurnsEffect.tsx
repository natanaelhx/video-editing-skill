import React from "react";
import { useCurrentFrame, useVideoConfig, Img } from "remotion";

interface KenBurnsEffectProps {
  src: string;
  direction?: "zoom-in" | "zoom-out" | "pan-left" | "pan-right";
  intensity?: number;
}

export const KenBurnsEffect: React.FC<KenBurnsEffectProps> = ({
  src, direction = "zoom-in", intensity = 0.2,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  let transform = "";
  if (direction === "zoom-in") {
    const scale = 1 + progress * intensity;
    transform = `scale(${scale})`;
  } else if (direction === "zoom-out") {
    const scale = 1 + intensity - progress * intensity;
    transform = `scale(${scale})`;
  } else if (direction === "pan-left") {
    const x = -progress * intensity * 100;
    transform = `scale(1.1) translateX(${x}%)`;
  } else if (direction === "pan-right") {
    const x = progress * intensity * 100;
    transform = `scale(1.1) translateX(${x}%)`;
  }

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform }} />
    </div>
  );
};
