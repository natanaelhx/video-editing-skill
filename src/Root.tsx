import React from "react";
import { Composition } from "remotion";
import { VideoEditor } from "./compositions/VideoEditor";
import { CutVideo } from "./compositions/CutVideo";
import { MergeVideos } from "./compositions/MergeVideos";
import { AddSubtitles } from "./compositions/AddSubtitles";
import { AddTransitions } from "./compositions/AddTransitions";
import { ColorGrading } from "./compositions/ColorGrading";
import { AddOverlays } from "./compositions/AddOverlays";
import { SocialMediaReformat } from "./compositions/SocialMediaReformat";
import { FullPipeline } from "./compositions/FullPipeline";
import { MyQuickClawAd } from "./compositions/MyQuickClawAd";
import { MyQuickClawDemo } from "./compositions/MyQuickClawDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoEditor"
        component={VideoEditor}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "",
        }}
      />
      <Composition
        id="CutVideo"
        component={CutVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "",
          startFrame: 0,
          endFrame: 300,
          fps: 30,
        }}
      />
      <Composition
        id="MergeVideos"
        component={MergeVideos}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videos: [],
          transition: "fade",
          transitionDuration: 15,
        }}
      />
      <Composition
        id="AddSubtitles"
        component={AddSubtitles}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "",
          srtFile: "",
          style: "modern",
          fontFamily: "Inter",
          fontSize: 48,
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.7)",
          position: "bottom",
        }}
      />
      <Composition
        id="AddTransitions"
        component={AddTransitions}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          clips: [],
          transitionType: "fade",
          transitionDuration: 20,
        }}
      />
      <Composition
        id="ColorGrading"
        component={ColorGrading}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "",
          preset: "cinematic",
          brightness: 1,
          contrast: 1,
          saturation: 1,
          hueRotate: 0,
        }}
      />
      <Composition
        id="AddOverlays"
        component={AddOverlays}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "",
          overlays: [],
        }}
      />
      <Composition
        id="SocialMediaReformat"
        component={SocialMediaReformat}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: "",
          platform: "instagram-reels",
          smartCrop: true,
          addSafeZones: true,
        }}
      />
      <Composition
        id="FullPipeline"
        component={FullPipeline}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "",
          pipeline: [],
        }}
      />
      <Composition
        id="MyQuickClawAd"
        component={MyQuickClawAd}
        durationInFrames={1590}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="MyQuickClawDemo"
        component={MyQuickClawDemo}
        durationInFrames={1590}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
