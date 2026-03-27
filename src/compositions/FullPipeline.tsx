import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface PipelineStep {
  action: string;
  [key: string]: any;
}

interface FullPipelineProps {
  src: string;
  pipeline: PipelineStep[];
}

export const FullPipeline: React.FC<FullPipelineProps> = ({ src, pipeline }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f1923 100%)",
    }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ color: "#fff", fontSize: 48, fontFamily: "Inter", fontWeight: 700, marginBottom: 32 }}>
          🎬 Full Pipeline
        </div>
        <div style={{ width: 600, height: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: "linear-gradient(90deg, #6c63ff, #00d4aa)",
            borderRadius: 4, transition: "width 0.1s",
          }} />
        </div>
        <div style={{ color: "#888", fontSize: 16, fontFamily: "Inter", marginTop: 16 }}>
          Processing {pipeline.length} steps • {Math.round(progress)}%
        </div>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 8 }}>
          {pipeline.map((step, i) => {
            const stepProgress = (i / pipeline.length) * 100;
            const isActive = progress >= stepProgress && progress < ((i + 1) / pipeline.length) * 100;
            const isDone = progress >= ((i + 1) / pipeline.length) * 100;
            return (
              <div key={i} style={{
                color: isDone ? "#00d4aa" : isActive ? "#6c63ff" : "#555",
                fontSize: 16, fontFamily: "JetBrains Mono, monospace",
                opacity: interpolate(frame, [i * 10, i * 10 + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                {isDone ? "✅" : isActive ? "⏳" : "⬜"} {step.action}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
