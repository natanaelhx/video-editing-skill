import { execSync } from "child_process";
import path from "path";

export interface TranscriptionResult {
  text: string;
  segments: { start: number; end: number; text: string; speaker?: string }[];
  language: string;
  duration: number;
}

export interface SceneResult {
  scenes: {
    index: number;
    start: number;
    end: number;
    duration: number;
    start_timecode: string;
    end_timecode: string;
  }[];
  total_scenes: number;
}

/**
 * Transcreve vídeo/áudio usando Whisper (local ou OpenAI API).
 * Chama o script Python transcribe.py.
 */
export async function transcribeVideo(options: {
  inputPath: string;
  outputPath?: string;
  language?: string;
  model?: string;
  useApi?: boolean;
  apiKey?: string;
}): Promise<TranscriptionResult> {
  const {
    inputPath,
    outputPath = "subtitles.srt",
    language = "pt",
    model = "base",
    useApi = false,
    apiKey,
  } = options;

  // Tenta via script Python local
  try {
    const scriptPath = path.resolve(__dirname, "../../scripts/transcribe.py");
    const apiFlag = useApi && (apiKey || process.env.OPENAI_API_KEY) ? "--api" : "";
    const cmd = `python3 "${scriptPath}" --input "${inputPath}" --output "${outputPath}" --language ${language} --model ${model} ${apiFlag}`;
    execSync(cmd, { timeout: 300000, stdio: "inherit" });

    // Lê o JSON gerado pelo script
    const jsonPath = outputPath.replace(/\.srt$/, ".json");
    const fs = require("fs");
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      return {
        text: data.text || "",
        segments: data.segments || [],
        language: data.language || language,
        duration: data.duration || 0,
      };
    }
  } catch (e) {
    console.warn("transcribeVideo: script Python falhou, tentando API direta...", e);
  }

  // Fallback: OpenAI API direto
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (key) {
    const fs = require("fs");
    const FormData = require("form-data");
    const fetch = require("node-fetch");

    const form = new FormData();
    form.append("file", fs.createReadStream(inputPath));
    form.append("model", "whisper-1");
    form.append("language", language);
    form.append("response_format", "verbose_json");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, ...form.getHeaders() },
      body: form,
    });
    const data = await response.json();
    return {
      text: data.text || "",
      segments: data.segments?.map((s: { start: number; end: number; text: string }) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      })) || [],
      language: data.language || language,
      duration: data.duration || 0,
    };
  }

  throw new Error("Transcrição falhou: configure OPENAI_API_KEY ou instale openai-whisper (pip install openai-whisper)");
}

/**
 * Detecta cenas em vídeo usando PySceneDetect.
 * Chama o script Python detect-scenes.py.
 */
export async function detectScenes(options: {
  inputPath: string;
  outputPath?: string;
  threshold?: number;
}): Promise<SceneResult> {
  const {
    inputPath,
    outputPath = "scenes.json",
    threshold = 30.0,
  } = options;

  try {
    const scriptPath = path.resolve(__dirname, "../../scripts/detect-scenes.py");
    const cmd = `python3 "${scriptPath}" --input "${inputPath}" --output "${outputPath}" --threshold ${threshold}`;
    execSync(cmd, { timeout: 120000, stdio: "inherit" });

    const fs = require("fs");
    if (fs.existsSync(outputPath)) {
      const data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
      return {
        scenes: data.scenes || [],
        total_scenes: data.total_scenes || 0,
      };
    }
  } catch (e) {
    console.warn("detectScenes falhou:", e);
  }

  // Fallback mínimo
  return {
    scenes: [
      { index: 1, start: 0, end: 5, duration: 5, start_timecode: "00:00:00.000", end_timecode: "00:00:05.000" },
    ],
    total_scenes: 1,
  };
}
