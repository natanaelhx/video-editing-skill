import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface AnimatedCaptionProps {
  text: string;
  style?: "karaoke" | "word-highlight" | "classic" | "modern" | "bounce";
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
}

export const AnimatedCaption: React.FC<AnimatedCaptionProps> = ({
  text, style = "modern", fontFamily = "Inter", fontSize = 48,
  color = "#FFFFFF", highlightColor = "#6c63ff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  if (style === "karaoke") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {words.map((word, i) => {
          const wordFrame = i * 8;
          const isHighlighted = frame >= wordFrame;
          return (
            <span key={i} style={{
              fontFamily, fontSize, fontWeight: 700,
              color: isHighlighted ? highlightColor : color,
              textShadow: isHighlighted ? `0 0 20px ${highlightColor}` : "0 2px 8px rgba(0,0,0,0.5)",
              transition: "color 0.1s",
            }}>
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (style === "bounce") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {words.map((word, i) => {
          const scale = spring({ frame: frame - i * 5, fps, config: { stiffness: 300, damping: 10 } });
          return (
            <span key={i} style={{
              fontFamily, fontSize, fontWeight: 700, color,
              transform: `scale(${scale})`, display: "inline-block",
              textShadow: "0 4px 12px rgba(0,0,0,0.6)",
            }}>
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{
      fontFamily, fontSize, fontWeight: 700, color, opacity,
      textShadow: "0 2px 8px rgba(0,0,0,0.5)", textAlign: "center",
      background: style === "modern" ? "linear-gradient(135deg, rgba(108,99,255,0.85), rgba(0,212,170,0.85))" : "rgba(0,0,0,0.7)",
      padding: "12px 28px", borderRadius: style === "modern" ? 12 : 4,
    }}>
      {text}
    </div>
  );
};
