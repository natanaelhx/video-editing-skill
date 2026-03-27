import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";

interface Clip {
  src: string;
  duration: number;
}

interface AddTransitionsProps {
  clips: Clip[];
  transitionType: string;
  transitionDuration: number;
}

export const AddTransitions: React.FC<AddTransitionsProps> = ({
  clips,
  transitionType = "fade",
  transitionDuration = 20,
}) => {
  const frame = useCurrentFrame();
  let offset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {clips.length === 0 ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0a0a0f, #1a1a2e)",
          }}
        >
          <div style={{ color: "#6c63ff", fontSize: 36, fontFamily: "Inter" }}>
            ✨ Transitions
          </div>
          <div style={{ color: "#888", fontSize: 18, fontFamily: "Inter", marginTop: 12 }}>
            Type: {transitionType} | Duration: {transitionDuration} frames
          </div>
        </AbsoluteFill>
      ) : (
        clips.map((clip, i) => {
          const from = offset;
          offset += clip.duration - (i < clips.length - 1 ? transitionDuration : 0);

          const enterOpacity = i === 0 ? 1 : interpolate(
            frame, [from, from + transitionDuration], [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const exitOpacity = i === clips.length - 1 ? 1 : interpolate(
            frame,
            [from + clip.duration - transitionDuration, from + clip.duration],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const slideX = transitionType === "slide"
            ? interpolate(frame, [from, from + transitionDuration], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;

          return (
            <Sequence key={i} from={from} durationInFrames={clip.duration}>
              <AbsoluteFill
                style={{
                  opacity: Math.min(enterOpacity, exitOpacity),
                  transform: `translateX(${slideX}%)`,
                }}
              >
                <OffthreadVideo
                  src={clip.src}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })
      )}
    </AbsoluteFill>
  );
};
