import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface Overlay {
  type: string;
  content?: string;
  src?: string;
  title?: string;
  subtitle?: string;
  position?: { x: number | string; y: number | string };
  animation?: string;
  startFrame: number;
  endFrame: number;
  style?: React.CSSProperties;
  opacity?: number;
  width?: number;
}

interface AddOverlaysProps {
  src: string;
  overlays: Overlay[];
}

export const AddOverlays: React.FC<AddOverlaysProps> = ({ src, overlays }) => {
  const frame = useCurrentFrame();

  const renderOverlay = (overlay: Overlay, index: number) => {
    if (frame < overlay.startFrame || frame > overlay.endFrame) return null;

    const localFrame = frame - overlay.startFrame;
    const duration = overlay.endFrame - overlay.startFrame;

    const enterProgress = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const exitProgress = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateRight: "clamp" });
    const opacity = Math.min(enterProgress, exitProgress);

    if (overlay.type === "text") {
      return (
        <div key={index} style={{
          position: "absolute", left: 60, bottom: 60, opacity,
          color: "#fff", fontSize: 42, fontFamily: "Inter", fontWeight: 700,
          textShadow: "0 4px 12px rgba(0,0,0,0.8)", ...overlay.style,
        }}>
          {overlay.content}
        </div>
      );
    }

    if (overlay.type === "lowerThird") {
      const slideX = interpolate(localFrame, [0, 20], [-100, 0], { extrapolateRight: "clamp" });
      return (
        <div key={index} style={{
          position: "absolute", left: 60, bottom: 100, opacity,
          transform: `translateX(${slideX}%)`,
        }}>
          <div style={{
            background: "linear-gradient(90deg, rgba(108,99,255,0.95), rgba(108,99,255,0.7))",
            padding: "16px 32px", borderRadius: "0 12px 12px 0",
            borderLeft: "4px solid #00d4aa",
          }}>
            <div style={{ color: "#fff", fontSize: 32, fontFamily: "Inter", fontWeight: 700 }}>
              {overlay.title}
            </div>
            {overlay.subtitle && (
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 20, fontFamily: "Inter", marginTop: 4 }}>
                {overlay.subtitle}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {src ? (
        <OffthreadVideo src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      ) : (
        <AbsoluteFill style={{
          background: "linear-gradient(135deg, #0a0a1a, #1a1a3e)",
          justifyContent: "center", alignItems: "center",
        }}>
          <div style={{ color: "#6c63ff", fontSize: 36, fontFamily: "Inter" }}>📌 Overlays</div>
        </AbsoluteFill>
      )}
      {overlays.map((overlay, i) => renderOverlay(overlay, i))}
    </AbsoluteFill>
  );
};
