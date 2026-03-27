import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface SocialMediaReformatProps {
  src: string;
  platform: string;
  smartCrop: boolean;
  addSafeZones: boolean;
}

const platformDimensions: Record<string, { width: number; height: number }> = {
  "instagram-reels": { width: 1080, height: 1920 },
  "youtube-shorts": { width: 1080, height: 1920 },
  "tiktok": { width: 1080, height: 1920 },
  "youtube": { width: 1920, height: 1080 },
  "linkedin": { width: 1080, height: 1080 },
  "twitter": { width: 1280, height: 720 },
};

export const SocialMediaReformat: React.FC<SocialMediaReformatProps> = ({
  src, platform = "instagram-reels", smartCrop = true, addSafeZones = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dims = platformDimensions[platform] || platformDimensions["instagram-reels"];
  const isVertical = dims.height > dims.width;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {src ? (
        <OffthreadVideo src={src} style={{
          width: "100%", height: "100%",
          objectFit: isVertical ? "cover" : "contain",
        }} />
      ) : (
        <AbsoluteFill style={{
          background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a3e 50%, #0a1a2e 100%)",
          justifyContent: "center", alignItems: "center",
        }}>
          <div style={{ color: "#00d4aa", fontSize: 32, fontFamily: "Inter", fontWeight: 700 }}>
            📱 {platform.replace("-", " ").toUpperCase()}
          </div>
          <div style={{ color: "#888", fontSize: 18, fontFamily: "Inter", marginTop: 12 }}>
            {dims.width}x{dims.height}
          </div>
        </AbsoluteFill>
      )}
      {addSafeZones && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(255,0,0,0.1), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(0deg, rgba(255,0,0,0.1), transparent)", pointerEvents: "none" }} />
        </>
      )}
    </AbsoluteFill>
  );
};
