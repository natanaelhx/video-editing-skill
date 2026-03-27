import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
} from "remotion";

interface CutVideoProps {
  src: string;
  startFrame: number;
  endFrame: number;
  fps: number;
}

export const CutVideo: React.FC<CutVideoProps> = ({
  src,
  startFrame,
  endFrame,
  fps,
}) => {
  const { width, height } = useVideoConfig();
  const durationInFrames = endFrame - startFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={durationInFrames}>
        {src ? (
          <OffthreadVideo
            src={src}
            startFrom={startFrame}
            endAt={endFrame}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            }}
          >
            <div style={{ color: "#6c63ff", fontSize: 36, fontFamily: "Inter" }}>
              ✂️ Cut Video
            </div>
            <div style={{ color: "#aaa", fontSize: 18, fontFamily: "Inter", marginTop: 12 }}>
              Frames {startFrame} → {endFrame} ({(durationInFrames / fps).toFixed(1)}s)
            </div>
          </AbsoluteFill>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
