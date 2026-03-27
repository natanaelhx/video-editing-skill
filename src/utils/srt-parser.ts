export interface SrtEntry {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
  startMs: number;
  endMs: number;
}

export function parseSrt(content: string): SrtEntry[] {
  const entries: SrtEntry[] = [];
  const blocks = content.trim().split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length < 3) continue;

    const index = parseInt(lines[0], 10);
    const timeParts = lines[1].split(" --> ");
    if (timeParts.length !== 2) continue;

    const startTime = timeParts[0].trim();
    const endTime = timeParts[1].trim();
    const text = lines.slice(2).join("\n");

    entries.push({
      index,
      startTime,
      endTime,
      text,
      startMs: timeToMs(startTime),
      endMs: timeToMs(endTime),
    });
  }

  return entries;
}

export function timeToMs(time: string): number {
  const [hours, minutes, rest] = time.split(":");
  const [seconds, ms] = rest.replace(",", ".").split(".");
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(seconds) * 1000 +
    parseInt(ms || "0")
  );
}

export function msToTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad3(millis)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function pad3(n: number): string {
  return n.toString().padStart(3, "0");
}

export function srtEntriesToFrames(entries: SrtEntry[], fps: number) {
  return entries.map((entry) => ({
    ...entry,
    startFrame: Math.round((entry.startMs / 1000) * fps),
    endFrame: Math.round((entry.endMs / 1000) * fps),
  }));
}

export function generateSrt(entries: SrtEntry[]): string {
  return entries
    .map((e, i) => `${i + 1}\n${e.startTime} --> ${e.endTime}\n${e.text}`)
    .join("\n\n");
}
