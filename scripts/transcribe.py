#!/usr/bin/env python3
"""
Video Transcription Script using OpenAI Whisper
Supports local Whisper model and OpenAI API
"""
import argparse
import json
import os
import sys
import subprocess

def transcribe_with_local_whisper(input_path, output_path, language, model_name):
    try:
        import whisper
    except ImportError:
        print("Installing whisper...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "openai-whisper"])
        import whisper

    print(f"Loading Whisper model: {model_name}")
    model = whisper.load_model(model_name)

    print(f"Transcribing: {input_path}")
    result = model.transcribe(input_path, language=language, verbose=True)

    segments = result.get("segments", [])
    srt_content = generate_srt(segments)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(srt_content)

    json_path = output_path.rsplit(".", 1)[0] + ".json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "text": result["text"],
            "language": result.get("language", language),
            "segments": [
                {"start": s["start"], "end": s["end"], "text": s["text"].strip()}
                for s in segments
            ]
        }, f, ensure_ascii=False, indent=2)

    print(f"SRT saved: {output_path}")
    print(f"JSON saved: {json_path}")
    return result

def transcribe_with_api(input_path, output_path, language, api_key):
    try:
        from openai import OpenAI
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "openai"])
        from openai import OpenAI

    client = OpenAI(api_key=api_key)

    with open(input_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language=language,
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )

    segments = transcript.segments or []
    srt_content = generate_srt_from_api(segments)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(srt_content)

    print(f"SRT saved: {output_path}")

def generate_srt(segments):
    lines = []
    for i, seg in enumerate(segments, 1):
        start = format_timestamp(seg["start"])
        end = format_timestamp(seg["end"])
        text = seg["text"].strip()
        lines.append(f"{i}\n{start} --> {end}\n{text}\n")
    return "\n".join(lines)

def generate_srt_from_api(segments):
    lines = []
    for i, seg in enumerate(segments, 1):
        start = format_timestamp(seg.start)
        end = format_timestamp(seg.end)
        text = seg.text.strip()
        lines.append(f"{i}\n{start} --> {end}\n{text}\n")
    return "\n".join(lines)

def format_timestamp(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def main():
    parser = argparse.ArgumentParser(description="Transcribe video/audio to SRT")
    parser.add_argument("--input", "-i", required=True, help="Input video/audio file")
    parser.add_argument("--output", "-o", default="subtitles.srt", help="Output SRT file")
    parser.add_argument("--language", "-l", default="pt", help="Language code")
    parser.add_argument("--model", "-m", default="base", help="Whisper model (tiny/base/small/medium/large-v3)")
    parser.add_argument("--api", action="store_true", help="Use OpenAI API instead of local model")
    parser.add_argument("--diarize", action="store_true", help="Enable speaker diarization")
    parser.add_argument("--remove-fillers", action="store_true", help="Remove filler words")
    parser.add_argument("--fillers", default="uh,um,eh,ah,like,you know", help="Filler words to remove")
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY", "")

    if args.api and api_key:
        transcribe_with_api(args.input, args.output, args.language, api_key)
    else:
        transcribe_with_local_whisper(args.input, args.output, args.language, args.model)

    print("Transcription complete!")

if __name__ == "__main__":
    main()
