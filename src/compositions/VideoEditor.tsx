import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface VideoEditorProps {
  src: string;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {src ? (
        <OffthreadVideo
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 48,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            🎬 Video Editor
          </div>
          <div
            style={{
              color: "#888",
              fontSize: 20,
              fontFamily: "Inter, sans-serif",
              marginTop: 16,
            }}
          >
            {width}x{height} @ {fps}fps • {Math.round(durationInFrames / fps)}s
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
