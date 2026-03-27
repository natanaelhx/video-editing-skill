import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

interface SubtitleEntry {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface AddSubtitlesProps {
  src: string;
  srtFile: string;
  style: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: string;
}

const sampleSubtitles: SubtitleEntry[] = [
  { text: "Welcome to the video editor", startFrame: 30, endFrame: 120 },
  { text: "Powered by Remotion + AI", startFrame: 150, endFrame: 240 },
  { text: "Create stunning videos programmatically", startFrame: 270, endFrame: 360 },
];

export const AddSubtitles: React.FC<AddSubtitlesProps> = ({
  src,
  srtFile,
  style: captionStyle = "modern",
  fontFamily = "Inter",
  fontSize = 48,
  color = "#FFFFFF",
  backgroundColor = "rgba(0,0,0,0.7)",
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentSubtitle = sampleSubtitles.find(
    (sub) => frame >= sub.startFrame && frame <= sub.endFrame
  );

  const positionStyles: Record<string, React.CSSProperties> = {
    bottom: { bottom: 80, left: 0, right: 0, justifyContent: "center" },
    top: { top: 80, left: 0, right: 0, justifyContent: "center" },
    center: { top: "50%", left: 0, right: 0, justifyContent: "center", transform: "translateY(-50%)" },
  };

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
            background: "linear-gradient(135deg, #1a1a3e, #2d1b69, #11001c)",
          }}
        />
      )}

      {currentSubtitle && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            ...positionStyles[position],
          }}
        >
          <div
            style={{
              background: captionStyle === "modern" ? "linear-gradient(135deg, rgba(108,99,255,0.9), rgba(0,212,170,0.9))" : backgroundColor,
              padding: "12px 32px",
              borderRadius: captionStyle === "modern" ? 16 : 4,
              fontFamily,
              fontSize,
              color,
              fontWeight: 700,
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              transform: `scale(${spring({ frame: frame - currentSubtitle.startFrame, fps, config: { stiffness: 200, damping: 20 } })})`,
            }}
          >
            {currentSubtitle.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
