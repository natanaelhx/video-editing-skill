import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface ColorGradingProps {
  src: string;
  preset: string;
  brightness: number;
  contrast: number;
  saturation: number;
  hueRotate: number;
}

const presets: Record<string, string> = {
  cinematic: "brightness(0.95) contrast(1.3) saturate(0.85) sepia(0.15)",
  vintage: "brightness(1.1) contrast(0.9) saturate(0.6) sepia(0.4) hue-rotate(-10deg)",
  cyberpunk: "brightness(1.1) contrast(1.4) saturate(1.5) hue-rotate(280deg)",
  warm: "brightness(1.05) contrast(1.05) saturate(1.1) sepia(0.2)",
  cool: "brightness(1.0) contrast(1.1) saturate(0.9) hue-rotate(190deg)",
  bw: "brightness(1.1) contrast(1.3) saturate(0) grayscale(1)",
  sepia: "brightness(1.0) contrast(1.1) sepia(0.8)",
};

export const ColorGrading: React.FC<ColorGradingProps> = ({
  src,
  preset = "cinematic",
  brightness = 1,
  contrast = 1,
  saturation = 1,
  hueRotate = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const filterStr = preset !== "custom"
    ? presets[preset] || presets.cinematic
    : `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) hue-rotate(${hueRotate}deg)`;

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {src ? (
        <OffthreadVideo
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: filterStr,
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #1a0a2e, #2d1b69, #0a1628)",
            filter: filterStr,
            opacity: fadeIn,
          }}
        >
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ color: "#fff", fontSize: 42, fontFamily: "Inter", fontWeight: 700 }}>
              🎨 Color Grading
            </div>
            <div style={{
              color: "#aaa", fontSize: 20, fontFamily: "Inter", marginTop: 16,
              background: "rgba(0,0,0,0.4)", padding: "8px 20px", borderRadius: 8,
            }}>
              Preset: {preset}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
