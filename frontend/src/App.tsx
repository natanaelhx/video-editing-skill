import React, { useState, useCallback, useRef } from "react";

interface VideoFile {
  file: File;
  url: string;
  name: string;
  duration: number;
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

const AI_TOOLS = [
  { icon: "🎙️", label: "Transcrever", action: "transcribe" },
  { icon: "📝", label: "Legendas", action: "captions" },
  { icon: "✂️", label: "Cortar Silêncio", action: "removeSilence" },
  { icon: "🎬", label: "Det. Cenas", action: "detectScenes" },
  { icon: "🎨", label: "Color Grade", action: "colorGrade" },
  { icon: "📱", label: "Reformat", action: "reformat" },
  { icon: "🔊", label: "Audio Duck", action: "audioDuck" },
  { icon: "🔄", label: "Frame Interp.", action: "frameInterp" },
  { icon: "👁️", label: "Eye Contact", action: "eyeContact" },
  { icon: "🗑️", label: "Rem. Fillers", action: "removeFillers" },
  { icon: "🎵", label: "Add Música", action: "addMusic" },
  { icon: "✨", label: "Auto Edit", action: "autoEdit" },
];

const PRESETS = [
  { name: "cinematic", label: "🎥 Cinematic" },
  { name: "vintage", label: "📷 Vintage" },
  { name: "cyberpunk", label: "🌃 Cyberpunk" },
  { name: "warm", label: "☀️ Warm" },
  { name: "cool", label: "❄️ Cool" },
  { name: "bw", label: "⬛ B&W" },
];

export default function App() {
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [clips, setClips] = useState<TimelineClip[]>([
    { id: "1", type: "video", name: "Main Video", startFrame: 0, durationInFrames: 450, track: 0 },
    { id: "2", type: "audio", name: "Background Music", startFrame: 30, durationInFrames: 400, track: 1 },
    { id: "3", type: "text", name: "Intro Title", startFrame: 0, durationInFrames: 90, track: 2 },
    { id: "4", type: "effect", name: "Fade Transition", startFrame: 200, durationInFrames: 30, track: 3 },
  ]);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderProgress, setRenderProgress] = useState(-1);
  const [activePanel, setActivePanel] = useState("tools");
  const [exportFormat, setExportFormat] = useState("mp4");
  const [exportQuality, setExportQuality] = useState("high");
  const [exportResolution, setExportResolution] = useState("1920x1080");
  const [colorPreset, setColorPreset] = useState("cinematic");
  const [aiLog, setAiLog] = useState<string[]>(["Sistema iniciado. Pronto para edição."]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalFrames = 900;
  const fps = 30;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      processVideoFile(file);
    }
  }, []);

  const processVideoFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideo({
      file, url, name: file.name, duration: 0,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
    });
    setAiLog(prev => [...prev, `📁 Vídeo carregado: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`]);
  };

  const handleAITool = (action: string) => {
    const messages: Record<string, string> = {
      transcribe: "🎙️ Iniciando transcrição com Whisper...",
      captions: "📝 Gerando legendas animadas...",
      removeSilence: "✂️ Detectando e removendo silêncios...",
      detectScenes: "🎬 Analisando cenas com IA...",
      colorGrade: `🎨 Aplicando color grading: ${colorPreset}`,
      reformat: "📱 Reformatando para 9:16 (vertical)...",
      audioDuck: "🔊 Aplicando audio ducking...",
      frameInterp: "🔄 Interpolando frames para slow motion...",
      eyeContact: "👁️ Corrigindo contato visual...",
      removeFillers: "🗑️ Removendo palavras de preenchimento...",
      addMusic: "🎵 Adicionando música de fundo...",
      autoEdit: "✨ Executando pipeline de edição automática...",
    };
    setAiLog(prev => [...prev, messages[action] || `⚙️ Executando: ${action}`]);
    setTimeout(() => {
      setAiLog(prev => [...prev, `✅ ${action} concluído com sucesso!`]);
    }, 2000);
  };

  const handleRender = () => {
    setRenderProgress(0);
    setAiLog(prev => [...prev, `🎬 Iniciando render: ${exportFormat} | ${exportResolution} | ${exportQuality}`]);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setAiLog(p => [...p, "✅ Render concluído! Arquivo salvo."]); return -1; }
        return prev + 2;
      });
    }, 100);
  };

  const formatTime = (frames: number) => {
    const secs = frames / fps;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const f = frames % fps;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(f).padStart(2,"0")}`;
  };

  return (
    <div className="app-layout">
      {/* HEADER */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">🎬</div>
          <span>AI Video Editor</span>
          <span style={{fontSize: 11, color: "var(--text-dimmed)", fontWeight: 400, marginLeft: 4}}>Remotion + OpenClaw</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>📂 Abrir</button>
          <button className="btn btn-ghost">💾 Salvar</button>
          <button className="btn btn-ghost">↩️ Desfazer</button>
          <button className="btn btn-accent" onClick={handleRender}>▶ Renderizar</button>
          <input ref={fileInputRef} type="file" accept="video/*" style={{display:"none"}} onChange={e => {
            if (e.target.files && e.target.files[0]) {
              processVideoFile(e.target.files[0]);
            }
          }} />
        </div>
      </header>

      {/* MAIN AREA */}
      <div className="app-main">
        {/* LEFT PANEL */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">🤖 Ferramentas IA</span>
          </div>
          <div className="panel-body">
            <div className="ai-tools-grid">
              {AI_TOOLS.map(tool => (
                <button key={tool.action} className="ai-tool-btn" onClick={() => handleAITool(tool.action)}>
                  <span className="ai-icon">{tool.icon}</span>
                  <span className="ai-label">{tool.label}</span>
                </button>
              ))}
            </div>
            <div style={{marginTop: 20}}>
              <div className="panel-title" style={{marginBottom: 10}}>🎨 Color Presets</div>
              <div style={{display:"flex", flexWrap:"wrap", gap: 6}}>
                {PRESETS.map(p => (
                  <button key={p.name} className="btn btn-secondary"
                    style={{fontSize: 11, padding: "6px 10px", borderColor: colorPreset === p.name ? 'var(--accent-primary)' : ''}} 
                    onClick={() => { setColorPreset(p.name); handleAITool("colorGrade"); }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginTop: 20}}>
              <div className="panel-title" style={{marginBottom: 10}}>📋 AI Log</div>
              <div style={{background:"var(--bg-tertiary)", borderRadius: 8, padding: 10, maxHeight: 200, overflowY: "auto", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", lineHeight: 1.8}}>
                {aiLog.map((msg, i) => <div key={i}>{msg}</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANE */}
        <div className="preview-container">
          <div className="preview-viewport" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
            {video ? (
              <video src={video.url} style={{maxWidth:"100%", maxHeight:"100%", borderRadius: 4}} controls />
            ) : (
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop} onDragOver={e => {e.preventDefault(); e.currentTarget.classList.add("dragover");}}
                onDragLeave={e => e.currentTarget.classList.remove("dragover")}>
                <div className="upload-icon">📹</div>
                <div className="upload-title">Arraste um vídeo ou clique para upload</div>
                <div className="upload-subtitle">MP4, WebM, MOV — até 2GB</div>
              </div>
            )}
          </div>
          <div className="preview-controls">
            <button className="btn btn-icon btn-ghost" onClick={() => setPlayhead(0)}>⏮</button>
            <button className="btn btn-icon btn-ghost" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "⏸" : "▶"}</button>
            <button className="btn btn-icon btn-ghost" onClick={() => setPlayhead(totalFrames)}>⏭</button>
            <span className="timecode">{formatTime(playhead)}</span>
            <div className="progress-bar" onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPlayhead(Math.round((e.clientX - rect.left) / rect.width * totalFrames));
            }}>
              <div className="progress-fill" style={{width: `${(playhead / totalFrames) * 100}%`}} />
            </div>
            <span className="timecode">{formatTime(totalFrames)}</span>
          </div>
        </div>

        {/* RIGHT PANEL - EXPORT */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">⚙️ Exportar</span>
          </div>
          <div className="panel-body">
            <div className="export-settings">
              <div className="setting-group">
                <label>Formato</label>
                <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
                  <option value="mp4">MP4 (H.264)</option>
                  <option value="webm">WebM (VP8)</option>
                  <option value="mov">MOV (ProRes)</option>
                  <option value="gif">GIF Animado</option>
                </select>
              </div>
              <div className="setting-group">
                <label>Qualidade</label>
                <select value={exportQuality} onChange={e => setExportQuality(e.target.value)}>
                  <option value="ultra">Ultra (CRF 18)</option>
                  <option value="high">Alta (CRF 23)</option>
                  <option value="medium">Média (CRF 28)</option>
                  <option value="low">Baixa (CRF 33)</option>
                </select>
              </div>
              <div className="setting-group">
                <label>Resolução</label>
                <select value={exportResolution} onChange={e => setExportResolution(e.target.value)}>
                  <option value="3840x2160">4K (3840x2160)</option>
                  <option value="1920x1080">Full HD (1920x1080)</option>
                  <option value="1280x720">HD (1280x720)</option>
                  <option value="1080x1920">Vertical (1080x1920)</option>
                  <option value="1080x1080">Quadrado (1080x1080)</option>
                </select>
              </div>
              <button className="btn btn-accent" style={{width: "100%", justifyContent: "center", marginTop: 8}} onClick={handleRender}>
                🚀 Renderizar Vídeo
              </button>
            </div>

            {renderProgress >= 0 && (
              <div className="render-progress animate-fadeIn">
                <div className="progress-label">
                  <span>Renderizando...</span>
                  <span>{renderProgress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{width: `${renderProgress}%`}} />
                </div>
              </div>
            )}
            
            <div style={{marginTop: 24}}>
              <div className="panel-title" style={{marginBottom: 10}}>📊 Informações</div>
              <div style={{fontSize: 12, color: "var(--text-muted)", lineHeight: 2}}>
                <div>📹 {video ? video.name : "Nenhum vídeo"}</div>
                <div>📦 {video ? video.size : "—"}</div>
                <div>⏱️ {formatTime(totalFrames)} ({(totalFrames/fps).toFixed(1)}s)</div>
                <div>🎞️ {totalFrames} frames @ {fps}fps</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="timeline-container">
        <div className="timeline-header">
          <div style={{display:"flex", gap: 8, alignItems: "center"}}>
            <span className="panel-title">🎞️ Timeline</span>
            <button className="btn btn-ghost" style={{fontSize: 11}}>+ Track</button>
          </div>
        </div>
        <div className="timeline-ruler">
          {Array.from({length: 31}, (_, i) => (
            <React.Fragment key={i}>
              <div className="tick" style={{left: `${100 + i * 60}px`}} />
              <div className="tick-label" style={{left: `${100 + i * 60}px`}}>
                {String(Math.floor(i)).padStart(2,"0")}:{String((i % 1) * 30).padStart(2,"0")}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="timeline-tracks" style={{position: "relative"}}>
          <div className="timeline-playhead" style={{left: `${100 + (playhead / totalFrames) * 1800}px`}} />
          {["🎬 Video", "🎵 Audio", "📝 Text", "✨ FX"].map((label, trackIdx) => (
            <div className="timeline-track" key={trackIdx}>
              <div className="timeline-track-label">{label}</div>
              <div className="timeline-track-content">
                {clips.filter(c => c.track === trackIdx).map(clip => (
                  <div key={clip.id} className={`timeline-clip ${clip.type}`}
                    style={{
                      left: `${(clip.startFrame / totalFrames) * 1800}px`,
                      width: `${(clip.durationInFrames / totalFrames) * 1800}px`,
                    }}>
                    {clip.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
