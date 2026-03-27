# Video Editing Skill — OpenClaw

> Skill de edição de vídeo programática com Remotion + IA pipeline.

## O que faz

Permite editar vídeos de forma programática usando React/TypeScript (Remotion) com pipeline de IA:
- Transcrição automática (Whisper local ou OpenAI API)
- Detecção de cenas (PySceneDetect)
- Legendas animadas (karaoke, bounce, modern)
- Color grading (7 presets: cinematic, vintage, cyberpunk, warm, cool, b&w, sepia)
- Corte, merge, transições (fade, slide, zoom, blur, flip)
- Reformatação para redes sociais (Instagram Reels, TikTok, YouTube Shorts, LinkedIn)
- Overlays e lower thirds animados
- Efeito Ken Burns para imagens
- Export configurável (MP4, WebM, MOV, GIF) com qualidade e resolução customizáveis
- Frontend visual com Timeline, AI Tools panel e preview

## Estrutura

```
video-editing-skill/
├── SKILL.md                          ← este arquivo
├── package.json                      ← dependências Node (Remotion 4 + React 18)
├── tsconfig.json                     ← configuração TypeScript
├── src/
│   ├── index.ts                      ← entry point Remotion
│   ├── Root.tsx                      ← registro de composições
│   ├── compositions/
│   │   ├── VideoEditor.tsx           ← editor base
│   │   ├── CutVideo.tsx              ← corte de vídeo
│   │   ├── MergeVideos.tsx           ← merge com transições
│   │   ├── AddSubtitles.tsx          ← legendas animadas
│   │   ├── AddTransitions.tsx        ← transições entre clipes
│   │   ├── ColorGrading.tsx          ← color grading com presets
│   │   ├── AddOverlays.tsx           ← texto, lower thirds, imagens
│   │   ├── SocialMediaReformat.tsx   ← reformatação para plataformas
│   │   └── FullPipeline.tsx          ← pipeline completo com progress bar
│   ├── components/
│   │   ├── AnimatedCaption.tsx       ← legendas animadas (karaoke, bounce, etc)
│   │   ├── KenBurnsEffect.tsx        ← efeito zoom/pan em imagens
│   │   └── LowerThird.tsx            ← lower third animado
│   ├── effects/
│   │   └── transitions.ts            ← definições de transições, filtros e animações
│   └── utils/
│       ├── ai-integration.ts         ← integração Whisper / detecção de cenas
│       ├── ffmpeg-commands.ts        ← comandos FFmpeg prontos
│       ├── media-helpers.ts          ← helpers de mídia (duração, resolução, etc)
│       └── srt-parser.ts             ← parser/gerador de arquivos SRT
├── scripts/
│   ├── render-video.ts               ← CLI de render headless
│   ├── transcribe.py                 ← transcrição com Whisper (local ou API)
│   ├── detect-scenes.py              ← detecção de cenas com PySceneDetect
│   ├── setup.sh                      ← setup Linux/macOS
│   └── setup.ps1                     ← setup Windows
└── frontend/
    ├── src/App.tsx                   ← UI completa (timeline, AI tools, export)
    ├── vite.config.ts
    └── package.json
```

## Setup

```bash
# Linux / macOS
bash scripts/setup.sh

# Windows
.\scripts\setup.ps1

# Manual
npm install
cd frontend && npm install && cd ..
pip install openai-whisper scenedetect[opencv] openai
```

## Uso

```bash
# Studio visual (Remotion)
npm run dev

# Frontend UI
npm run frontend

# Render headless
npx ts-node scripts/render-video.ts CutVideo /path/to/video.mp4 output.mp4

# Transcrição
python3 scripts/transcribe.py --input video.mp4 --output subtitles.srt --language pt

# Detecção de cenas
python3 scripts/detect-scenes.py --input video.mp4 --output scenes.json
```

## Variáveis de ambiente (opcionais)

```bash
OPENAI_API_KEY=sk-...   # para transcrição via API (mais rápido que local)
```

## Composições disponíveis

| ID | Descrição | Props principais |
|----|-----------|-----------------|
| `VideoEditor` | Editor base | `src` |
| `CutVideo` | Corta trecho | `src`, `startFrame`, `endFrame`, `fps` |
| `MergeVideos` | Junta vídeos | `videos[]`, `transition`, `transitionDuration` |
| `AddSubtitles` | Adiciona legendas | `src`, `srtFile`, `style`, `position` |
| `AddTransitions` | Transições entre clipes | `clips[]`, `transitionType`, `transitionDuration` |
| `ColorGrading` | Color grading | `src`, `preset`, `brightness`, `contrast`, `saturation` |
| `AddOverlays` | Overlays e lower thirds | `src`, `overlays[]` |
| `SocialMediaReformat` | Reformata para plataformas | `src`, `platform`, `smartCrop` |
| `FullPipeline` | Pipeline completo | `src`, `pipeline[]` |

## Dependências externas

- **Node.js 18+**
- **FFmpeg** (para comandos de processamento)
- **Python 3.8+** (para scripts de IA)
- **OPENAI_API_KEY** (opcional — para Whisper API)
