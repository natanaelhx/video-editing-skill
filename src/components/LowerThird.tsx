import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface LowerThirdProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
  animation?: "slideIn" | "fadeIn" | "expandWidth";
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  title, subtitle, accentColor = "#6c63ff", animation = "slideIn",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { stiffness: 100, damping: 15 } });
  const slideX = animation === "slideIn" ? interpolate(enter, [0, 1], [-100, 0]) : 0;
  const opacity = animation === "fadeIn" ? enter : 1;
  const width = animation === "expandWidth" ? `${enter * 100}%` : "auto";

  return (
    <div style={{
      position: "absolute", left: 60, bottom: 80,
      transform: `translateX(${slideX}%)`, opacity, overflow: "hidden",
    }}>
      <div style={{
        background: `linear-gradient(90deg, ${accentColor}ee, ${accentColor}88)`,
        padding: "16px 40px 16px 20px", borderRadius: "0 12px 12px 0",
        borderLeft: `5px solid #00d4aa`, width, backdropFilter: "blur(8px)",
      }}>
        <div style={{ color: "#fff", fontSize: 28, fontFamily: "Inter", fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, fontFamily: "Inter", marginTop: 4 }}>{subtitle}</div>}
      </div>
    </div>
  );
};
