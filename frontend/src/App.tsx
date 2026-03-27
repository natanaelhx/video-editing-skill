import React, { useState, useCallback, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { MyQuickClawAd } from "../../src/compositions/MyQuickClawAd";

// ──────────────────────────────────────────────
// TIPOS
// ──────────────────────────────────────────────
interface VideoFile {
  file: File;
  url: string;
  name: string;
  size: string;
}

interface TimelineClip {
  id: string;
  type: "video" | "audio" | "text" | "effect";
  name: string;
  startFrame: number;
  durationInFrames: number;
  track: number;
}

// ──────────────────────────────────────────────
// CONSTANTES
// ──────────────────────────────────────────────
const COLORS = {
  bg:        "#080B14",
  surface:   "#0F1628",
  border:    "rgba(108,99,255,0.2)",
  primary:   "#6C63FF",
  cyan:      "#00D4AA",
  white:     "#FFFFFF",
  gray:      "#A0AEC0",
  dimmed:    "#4A5568",
  gradBrand: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
};

const FONT = "'Inter', sans-serif";

const AI_TOOLS = [
  { icon: "🎙️", label: "Transcrever",     action: "transcribe" },
  { icon: "📝", label: "Legendas",         action: "captions" },
  { icon: "✂️", label: "Rem. Silêncio",   action: "removeSilence" },
  { icon: "🎬", label: "Det. Cenas",       action: "detectScenes" },
  { icon: "🎨", label: "Color Grade",      action: "colorGrade" },
  { icon: "📱", label: "Reformat",         action: "reformat" },
  { icon: "🔊", label: "Audio Duck",       action: "audioDuck" },
  { icon: "🔄", label: "Frame Interp.",    action: "frameInterp" },
  { icon: "👁️", label: "Eye Contact",     action: "eyeContact" },
  { icon: "🗑️", label: "Rem. Fillers",    action: "removeFillers" },
  { icon: "🎵", label: "Add Música",       action: "addMusic" },
  { icon: "✨", label: "Auto Edit",        action: "autoEdit" },
];

const COLOR_PRESETS = [
  { name: "cinematic",  label: "🎥 Cinematic" },
  { name: "vintage",    label: "📷 Vintage" },
  { name: "cyberpunk",  label: "🌃 Cyberpunk" },
  { name: "warm",       label: "☀️ Warm" },
  { name: "cool",       label: "❄️ Cool" },
  { name: "bw",         label: "⬛ B&W" },
];

const COMPOSITIONS = [
  { id: "MyQuickClawAd", label: "⚡ myQuickClaw Ad",    duration: 1590, fps: 30 },
  { id: "VideoEditor",   label: "🎬 Video Editor",      duration: 900,  fps: 30 },
  { id: "FullPipeline",  label: "🔧 Full Pipeline",     duration: 1800, fps: 30 },
];

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────
export default function App() {
  const playerRef = useRef<PlayerRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [video, setVideo]               = useState<VideoFile | null>(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [renderProgress, setRenderProgress] = useState(-1);
  const [colorPreset, setColorPreset]   = useState("cinematic");
  const [exportFormat, setExportFormat] = useState("mp4");
  const [exportQuality, setExportQuality] = useState("high");
  const [exportResolution, setExportResolution] = useState("1920x1080");
  const [aiLog, setAiLog]               = useState<string[]>(["✅ Sistema iniciado. Preview do myQuickClaw Ad carregado."]);
  const [activeComp, setActiveComp]     = useState("MyQuickClawAd");
  const [sidePanel, setSidePanel]       = useState<"tools" | "export" | "compositions">("compositions");

  const totalFrames = COMPOSITIONS.find(c => c.id === activeComp)?.duration || 1590;
  const fps = 30;

  const clips: TimelineClip[] = [
    { id: "1", type: "video",  name: "Cena 1 — Headline",       startFrame: 0,    durationInFrames: 240,  track: 0 },
    { id: "2", type: "video",  name: "Cena 2 — Logo Reveal",    startFrame: 225,  durationInFrames: 315,  track: 0 },
    { id: "3", type: "video",  name: "Cena 3 — Split Screen",   startFrame: 525,  durationInFrames: 345,  track: 0 },
    { id: "4", type: "video",  name: "Cena 4 — EDIT/SCALE",     startFrame: 855,  durationInFrames: 345,  track: 0 },
    { id: "5", type: "video",  name: "Cena 5 — CTA Final",      startFrame: 1185, durationInFrames: 405,  track: 0 },
    { id: "6", type: "audio",  name: "🎵 Trilha — Eletrônica",  startFrame: 0,    durationInFrames: 1590, track: 1 },
    { id: "7", type: "text",   name: "📝 Legendas PT-BR",       startFrame: 525,  durationInFrames: 300,  track: 2 },
    { id: "8", type: "effect", name: "✨ Cross-fade transitions",startFrame: 210,  durationInFrames: 30,   track: 3 },
  ];

  const formatTime = (frames: number) => {
    const secs = frames / fps;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const f = frames % fps;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(f).padStart(2,"0")}`;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) processVideoFile(file);
  }, []);

  const processVideoFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideo({ file, url, name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + " MB" });
    addLog(`📁 Vídeo carregado: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
  };

  const addLog = (msg: string) => setAiLog(prev => [...prev, msg]);

  const handleAITool = (action: string) => {
    const messages: Record<string, string> = {
      transcribe:    "🎙️ Iniciando transcrição com Whisper...",
      captions:      "📝 Gerando legendas animadas...",
      removeSilence: "✂️ Detectando e removendo silêncios...",
      detectScenes:  "🎬 Analisando cenas com IA...",
      colorGrade:    `🎨 Aplicando preset: ${colorPreset}`,
      reformat:      "📱 Reformatando para 9:16...",
      audioDuck:     "🔊 Aplicando audio ducking...",
      frameInterp:   "🔄 Interpolando frames (slow motion)...",
      eyeContact:    "👁️ Corrigindo contato visual...",
      removeFillers: "🗑️ Removendo palavras de preenchimento...",
      addMusic:      "🎵 Adicionando música de fundo...",
      autoEdit:      "✨ Executando pipeline completo de edição...",
    };
    addLog(messages[action] || `⚙️ ${action}`);
    setTimeout(() => addLog(`✅ ${action} concluído!`), 2000);
  };

  const handleRender = () => {
    setRenderProgress(0);
    addLog(`🚀 Render iniciado: ${exportFormat.toUpperCase()} | ${exportResolution} | ${exportQuality}`);
    const iv = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(iv);
          addLog("✅ Render concluído! Arquivo salvo.");
          return -1;
        }
        return prev + 1.5;
      });
    }, 80);
  };

  const trackColors: Record<string, string> = {
    video:  COLORS.primary,
    audio:  COLORS.cyan,
    text:   "#A78BFA",
    effect: "#F59E0B",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: COLORS.bg, fontFamily: FONT, color: COLORS.white, overflow: "hidden" }}>

      {/* ── HEADER ── */}
      <header style={{
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.surface, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: COLORS.gradBrand,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>AI Video Editor</span>
          <span style={{ fontSize: 12, color: COLORS.dimmed, fontWeight: 400 }}>Remotion + OpenClaw</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["📂 Abrir", "💾 Salvar", "↩️ Undo"].map(btn => (
            <button key={btn} onClick={() => fileInputRef.current?.click()} style={{
              background: "transparent", border: `1px solid ${COLORS.border}`,
              color: COLORS.gray, borderRadius: 8, padding: "6px 14px",
              fontSize: 13, cursor: "pointer", fontFamily: FONT,
            }}>{btn}</button>
          ))}
          <button onClick={handleRender} style={{
            background: COLORS.gradBrand, border: "none",
            color: COLORS.white, borderRadius: 8, padding: "6px 18px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT,
          }}>▶ Renderizar</button>
          <input ref={fileInputRef} type="file" accept="video/*" style={{ display: "none" }}
            onChange={e => { if (e.target.files?.[0]) processVideoFile(e.target.files[0]); }} />
        </div>
      </header>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: 260, borderRight: `1px solid ${COLORS.border}`,
          background: COLORS.surface, display: "flex", flexDirection: "column",
          overflow: "hidden", flexShrink: 0,
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${COLORS.border}` }}>
            {(["compositions", "tools", "export"] as const).map(tab => (
              <button key={tab} onClick={() => setSidePanel(tab)} style={{
                flex: 1, padding: "10px 4px", fontSize: 11, fontWeight: 600,
                background: "transparent", border: "none", cursor: "pointer",
                fontFamily: FONT, textTransform: "capitalize",
                color: sidePanel === tab ? COLORS.primary : COLORS.dimmed,
                borderBottom: sidePanel === tab ? `2px solid ${COLORS.primary}` : "2px solid transparent",
              }}>{tab === "compositions" ? "🎬" : tab === "tools" ? "🤖 IA" : "⚙️"} {tab}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>

            {/* COMPOSITIONS PANEL */}
            {sidePanel === "compositions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dimmed, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Composições</div>
                {COMPOSITIONS.map(comp => (
                  <button key={comp.id} onClick={() => setActiveComp(comp.id)} style={{
                    background: activeComp === comp.id ? `${COLORS.primary}22` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${activeComp === comp.id ? COLORS.primary + "66" : COLORS.border}`,
                    borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                    fontFamily: FONT, textAlign: "left", color: COLORS.white,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{comp.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.dimmed, marginTop: 4 }}>
                      {Math.round(comp.duration / comp.fps)}s · {comp.fps}fps · {comp.duration}f
                    </div>
                  </button>
                ))}

                {/* AI Log */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dimmed, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>📋 Log</div>
                  <div style={{
                    background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: 10,
                    maxHeight: 200, overflowY: "auto", fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace", color: COLORS.gray, lineHeight: 1.9,
                  }}>
                    {aiLog.map((msg, i) => <div key={i}>{msg}</div>)}
                  </div>
                </div>
              </div>
            )}

            {/* AI TOOLS PANEL */}
            {sidePanel === "tools" && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dimmed, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Ferramentas IA</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {AI_TOOLS.map(tool => (
                    <button key={tool.action} onClick={() => handleAITool(tool.action)} style={{
                      background: "rgba(108,99,255,0.08)", border: `1px solid ${COLORS.border}`,
                      borderRadius: 10, padding: "12px 8px", cursor: "pointer",
                      fontFamily: FONT, color: COLORS.white, textAlign: "center",
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = COLORS.primary)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = COLORS.border)}
                    >
                      <div style={{ fontSize: 20 }}>{tool.icon}</div>
                      <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 4 }}>{tool.label}</div>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dimmed, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>🎨 Color Presets</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {COLOR_PRESETS.map(p => (
                      <button key={p.name} onClick={() => { setColorPreset(p.name); handleAITool("colorGrade"); }} style={{
                        background: colorPreset === p.name ? `${COLORS.primary}33` : "transparent",
                        border: `1px solid ${colorPreset === p.name ? COLORS.primary : COLORS.border}`,
                        borderRadius: 8, padding: "6px 10px", fontSize: 11,
                        color: COLORS.white, cursor: "pointer", fontFamily: FONT,
                      }}>{p.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EXPORT PANEL */}
            {sidePanel === "export" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.dimmed, letterSpacing: 1, textTransform: "uppercase" }}>Exportar</div>
                {[
                  { label: "Formato", value: exportFormat, setter: setExportFormat, options: [["mp4","MP4 (H.264)"],["webm","WebM"],["mov","MOV"],["gif","GIF"]] },
                  { label: "Qualidade", value: exportQuality, setter: setExportQuality, options: [["ultra","Ultra (CRF18)"],["high","Alta (CRF23)"],["medium","Média"],["low","Baixa"]] },
                  { label: "Resolução", value: exportResolution, setter: setExportResolution, options: [["3840x2160","4K"],["1920x1080","Full HD"],["1280x720","HD"],["1080x1920","Vertical"]] },
                ].map(({ label, value, setter, options }) => (
                  <div key={label}>
                    <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 6 }}>{label}</div>
                    <select value={value} onChange={e => setter(e.target.value)} style={{
                      width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                      borderRadius: 8, padding: "8px 12px", color: COLORS.white,
                      fontFamily: FONT, fontSize: 13, cursor: "pointer",
                    }}>
                      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
                <button onClick={handleRender} style={{
                  background: COLORS.gradBrand, border: "none", borderRadius: 10,
                  padding: "12px", color: COLORS.white, fontWeight: 700,
                  fontSize: 14, cursor: "pointer", fontFamily: FONT, marginTop: 8,
                }}>🚀 Renderizar</button>
                {renderProgress >= 0 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.gray, marginBottom: 6 }}>
                      <span>Renderizando...</span><span>{Math.round(renderProgress)}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${renderProgress}%`, background: COLORS.gradBrand, borderRadius: 3 }} />
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 8, fontSize: 12, color: COLORS.dimmed, lineHeight: 1.8 }}>
                  <div>⏱️ {formatTime(totalFrames)} ({(totalFrames / fps).toFixed(1)}s)</div>
                  <div>🎞️ {totalFrames}f @ {fps}fps</div>
                  <div>📹 {video ? video.name : "Composição Remotion"}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER — PLAYER */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Player Area */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            background: "#000", overflow: "hidden", position: "relative",
          }}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            {activeComp === "MyQuickClawAd" ? (
              <Player
                ref={playerRef}
                component={MyQuickClawAd}
                durationInFrames={1590}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{ width: "100%", maxHeight: "100%" }}
                controls
                showVolumeControls
                loop
                inputProps={{}}
                onFrameUpdate={(f) => setCurrentFrame(f)}
              />
            ) : (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 16,
                color: COLORS.dimmed,
              }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ fontSize: 64 }}>📹</div>
                <div style={{ fontWeight: 600, fontSize: 18, color: COLORS.gray }}>
                  Arraste um vídeo ou clique para carregar
                </div>
                <div style={{ fontSize: 14 }}>MP4, WebM, MOV — até 2GB</div>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div style={{
            height: 44, background: COLORS.surface,
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: COLORS.gray, minWidth: 80 }}>
              {formatTime(currentFrame)}
            </span>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, cursor: "pointer", overflow: "hidden" }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const f = Math.round((e.clientX - rect.left) / rect.width * totalFrames);
                playerRef.current?.seekTo(f);
              }}
            >
              <div style={{
                height: "100%", width: `${(currentFrame / totalFrames) * 100}%`,
                background: COLORS.gradBrand, borderRadius: 2,
              }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: COLORS.dimmed, minWidth: 80, textAlign: "right" }}>
              {formatTime(totalFrames)}
            </span>
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div style={{
        height: 180, borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.surface, flexShrink: 0, overflow: "hidden",
      }}>
        {/* Timeline header */}
        <div style={{
          height: 32, borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", padding: "0 16px",
          gap: 12,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gray }}>🎞️ Timeline</span>
          <span style={{ fontSize: 11, color: COLORS.dimmed }}>{activeComp}</span>
        </div>

        {/* Tracks */}
        <div style={{ overflowX: "auto", overflowY: "hidden", position: "relative", height: 148 }}>
          {/* Playhead */}
          <div style={{
            position: "absolute",
            left: 120 + (currentFrame / totalFrames) * (totalFrames * 0.12),
            top: 0, bottom: 0,
            width: 2,
            background: COLORS.cyan,
            zIndex: 10,
            pointerEvents: "none",
            boxShadow: `0 0 8px ${COLORS.cyan}`,
          }} />

          {["🎬 Video", "🎵 Audio", "📝 Text", "✨ FX"].map((trackLabel, trackIdx) => (
            <div key={trackIdx} style={{
              display: "flex", alignItems: "center", height: 34,
              borderBottom: `1px solid rgba(255,255,255,0.04)`,
            }}>
              {/* Label */}
              <div style={{
                width: 120, flexShrink: 0,
                fontSize: 11, color: COLORS.dimmed,
                padding: "0 12px", borderRight: `1px solid ${COLORS.border}`,
              }}>
                {trackLabel}
              </div>
              {/* Clips */}
              <div style={{ position: "relative", flex: 1, height: "100%" }}>
                {clips.filter(c => c.track === trackIdx).map(clip => {
                  const left = (clip.startFrame / totalFrames) * 100;
                  const width = (clip.durationInFrames / totalFrames) * 100;
                  const color = trackColors[clip.type];
                  return (
                    <div key={clip.id} style={{
                      position: "absolute",
                      left: `${left}%`,
                      width: `${width}%`,
                      top: 3, bottom: 3,
                      background: `${color}22`,
                      border: `1px solid ${color}66`,
                      borderRadius: 6,
                      display: "flex", alignItems: "center",
                      padding: "0 8px", overflow: "hidden",
                      fontSize: 10, fontWeight: 600, color,
                      cursor: "pointer", userSelect: "none",
                    }}>
                      {clip.name}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
