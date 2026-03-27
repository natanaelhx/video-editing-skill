import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

async function main() {
  const compositionId = process.argv[2] || "VideoEditor";
  const inputVideo   = process.argv[3] || "";
  const outputFile   = process.argv[4] || `output_${Date.now()}.mp4`;

  console.log(`🎬 Rendering composition: ${compositionId}`);
  console.log(`📥 Input: ${inputVideo || "(none)"}`);
  console.log(`📤 Output: ${outputFile}`);

  const bundled = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    webpackOverride: (config) => config,
  });

  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps: { src: inputVideo },
  });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputFile,
    inputProps: { src: inputVideo },
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  Progress: ${Math.round(progress * 100)}%`);
    },
  });

  console.log(`\n✅ Render complete: ${outputFile}`);
}

main().catch((err) => {
  console.error("❌ Render failed:", err);
  process.exit(1);
});
