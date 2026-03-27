import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";

interface VideoClip {
  src: string;
  durationInFrames: number;
}

interface MergeVideosProps {
  videos: VideoClip[];
  transition: string;
  transitionDuration: number;
}

export const MergeVideos: React.FC<MergeVideosProps> = ({
  videos,
  transition = "fade",
  transitionDuration = 15,
}) => {
  const frame = useCurrentFrame();
  let currentOffset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {videos.length === 0 ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          }}
        >
          <div style={{ color: "#00d4aa", fontSize: 36, fontFamily: "Inter" }}>
            🔗 Merge Videos
          </div>
          <div style={{ color: "#aaa", fontSize: 18, fontFamily: "Inter", marginTop: 12 }}>
            Provide video clips to merge
          </div>
        </AbsoluteFill>
      ) : (
        videos.map((video, index) => {
          const from = currentOffset;
          currentOffset += video.durationInFrames - (index < videos.length - 1 ? transitionDuration : 0);

          const opacity = transition === "fade"
            ? interpolate(
                frame,
                [from, from + transitionDuration, from + video.durationInFrames - transitionDuration, from + video.durationInFrames],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            : 1;

          return (
            <Sequence key={index} from={from} durationInFrames={video.durationInFrames}>
              <AbsoluteFill style={{ opacity }}>
                <OffthreadVideo
                  src={video.src}
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
