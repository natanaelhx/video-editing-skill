export const ffmpegCommands = {
  cut: (input: string, start: string, end: string, output: string) =>
    `ffmpeg -i "${input}" -ss ${start} -to ${end} -c copy "${output}"`,

  merge: (listFile: string, output: string) =>
    `ffmpeg -f concat -safe 0 -i "${listFile}" -c copy "${output}"`,

  resize: (input: string, width: number, height: number, output: string) =>
    `ffmpeg -i "${input}" -vf "scale=${width}:${height}" "${output}"`,

  extractAudio: (input: string, output: string) =>
    `ffmpeg -i "${input}" -vn -acodec libmp3lame -q:a 2 "${output}"`,

  thumbnail: (input: string, time: string, output: string) =>
    `ffmpeg -i "${input}" -ss ${time} -vframes 1 "${output}"`,

  gif: (input: string, fps: number, width: number, output: string) =>
    `ffmpeg -i "${input}" -vf "fps=${fps},scale=${width}:-1:flags=lanczos" "${output}"`,

  normalizeAudio: (input: string, output: string) =>
    `ffmpeg -i "${input}" -af loudnorm=I=-16:LRA=11:TP=-1 "${output}"`,

  removeSilence: (input: string, threshold: number, output: string) =>
    `ffmpeg -i "${input}" -af "silenceremove=start_periods=1:start_duration=0.5:start_threshold=${threshold}dB:detection=peak" "${output}"`,

  audioDucking: (video: string, music: string, musicVolume: number, output: string) =>
    `ffmpeg -i "${video}" -i "${music}" -filter_complex "[1:a]volume=${musicVolume}[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=2" -c:v copy "${output}"`,

  smartReframe: (input: string, output: string) =>
    `ffmpeg -i "${input}" -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0" -c:a copy "${output}"`,

  addWatermark: (input: string, watermark: string, position: string, output: string) => {
    const positions: Record<string, string> = {
      "top-left": "overlay=10:10",
      "top-right": "overlay=W-w-10:10",
      "bottom-left": "overlay=10:H-h-10",
      "bottom-right": "overlay=W-w-10:H-h-10",
      "center": "overlay=(W-w)/2:(H-h)/2",
    };
    return `ffmpeg -i "${input}" -i "${watermark}" -filter_complex "${positions[position] || positions["bottom-right"]}" "${output}"`;
  },

  getInfo: (input: string) =>
    `ffprobe -v quiet -print_format json -show_format -show_streams "${input}"`,

  compress: (input: string, crf: number, output: string) =>
    `ffmpeg -i "${input}" -c:v libx264 -crf ${crf} -preset medium -c:a aac -b:a 128k "${output}"`,
};
