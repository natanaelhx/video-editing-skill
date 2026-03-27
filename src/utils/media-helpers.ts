import { execSync } from "child_process";

/**
 * Retorna a duração real do vídeo via ffprobe.
 * Fallback para 30s se ffprobe não estiver disponível.
 */
export function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve) => {
    try {
      const result = execSync(
        `ffprobe -v quiet -print_format json -show_format "${filePath}"`,
        { timeout: 10000 }
      ).toString();
      const data = JSON.parse(result);
      const duration = parseFloat(data?.format?.duration || "30");
      resolve(isNaN(duration) ? 30 : duration);
    } catch {
      // fallback se ffprobe não estiver instalado
      resolve(30);
    }
  });
}

/**
 * Retorna a resolução real do vídeo via ffprobe.
 * Fallback para 1920x1080 se ffprobe não estiver disponível.
 */
export function getVideoResolution(
  filePath: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    try {
      const result = execSync(
        `ffprobe -v quiet -print_format json -show_streams "${filePath}"`,
        { timeout: 10000 }
      ).toString();
      const data = JSON.parse(result);
      const videoStream = data?.streams?.find(
        (s: { codec_type: string }) => s.codec_type === "video"
      );
      if (videoStream?.width && videoStream?.height) {
        resolve({ width: videoStream.width, height: videoStream.height });
      } else {
        resolve({ width: 1920, height: 1080 });
      }
    } catch {
      resolve({ width: 1920, height: 1080 });
    }
  });
}

export function calculateFrameCount(durationSeconds: number, fps: number): number {
  return Math.ceil(durationSeconds * fps);
}

export function secondsToTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}

export function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(":");
  const [sec, ms] = (parts[2] || "0.0").split(".");
  return (
    parseInt(parts[0]) * 3600 +
    parseInt(parts[1]) * 60 +
    parseInt(sec) +
    parseInt(ms || "0") / 1000
  );
}

export function generateOutputFilename(
  input: string,
  suffix: string,
  ext?: string
): string {
  const parts = input.split(".");
  const extension = ext || parts.pop() || "mp4";
  return parts.join(".") + "_" + suffix + "." + extension;
}

export const supportedFormats = {
  video: ["mp4", "webm", "mov", "avi", "mkv", "flv"],
  audio: ["mp3", "wav", "aac", "ogg", "flac", "m4a"],
  image: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"],
  subtitle: ["srt", "vtt", "ass", "ssa"],
};

export function isFormatSupported(
  filename: string,
  type: keyof typeof supportedFormats
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return supportedFormats[type].includes(ext);
}
