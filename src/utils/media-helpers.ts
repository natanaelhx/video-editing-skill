export function getMediaDuration(filePath: string): Promise<number> {
  return new Promise((resolve) => resolve(30));
}

export function getVideoResolution(filePath: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => resolve({ width: 1920, height: 1080 }));
}

export function calculateFrameCount(durationSeconds: number, fps: number): number {
  return Math.ceil(durationSeconds * fps);
}

export function secondsToTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return h.toString().padStart(2, "0") + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0") + "." + ms.toString().padStart(3, "0");
}

export function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(":");
  const [sec, ms] = (parts[2] || "0.0").split(".");
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(sec) + (parseInt(ms || "0") / 1000);
}

export function generateOutputFilename(input: string, suffix: string, ext?: string): string {
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

export function isFormatSupported(filename: string, type: keyof typeof supportedFormats): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return supportedFormats[type].includes(ext);
}
