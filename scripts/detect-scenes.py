#!/usr/bin/env python3
"""Scene Detection Script using PySceneDetect"""
import argparse
import json
import os
import sys
import subprocess

def detect_scenes(input_path, output_path, threshold):
    try:
        from scenedetect import open_video, SceneManager
        from scenedetect.detectors import ContentDetector, ThresholdDetector
    except ImportError:
        print("Installing scenedetect...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "scenedetect[opencv]"])
        from scenedetect import open_video, SceneManager
        from scenedetect.detectors import ContentDetector

    print(f"Detecting scenes in: {input_path}")
    video = open_video(input_path)
    scene_manager = SceneManager()
    scene_manager.add_detector(ContentDetector(threshold=threshold))
    scene_manager.detect_scenes(video, show_progress=True)
    scene_list = scene_manager.get_scene_list()

    scenes = []
    for i, (start, end) in enumerate(scene_list):
        scenes.append({
            "index": i + 1,
            "start": start.get_seconds(),
            "end": end.get_seconds(),
            "start_frame": start.get_frames(),
            "end_frame": end.get_frames(),
            "duration": (end - start).get_seconds(),
            "start_timecode": str(start),
            "end_timecode": str(end),
        })

    result = {
        "input": input_path,
        "total_scenes": len(scenes),
        "threshold": threshold,
        "scenes": scenes,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Detected {len(scenes)} scenes")
    print(f"Results saved: {output_path}")
    return result

def main():
    parser = argparse.ArgumentParser(description="Detect scenes in video")
    parser.add_argument("--input", "-i", required=True, help="Input video file")
    parser.add_argument("--output", "-o", default="scenes.json", help="Output JSON file")
    parser.add_argument("--threshold", "-t", type=float, default=30.0, help="Detection threshold (1-100)")
    args = parser.parse_args()

    detect_scenes(args.input, args.output, args.threshold)

if __name__ == "__main__":
    main()
