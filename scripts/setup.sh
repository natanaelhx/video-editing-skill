#!/bin/bash
echo "====================================="
echo "  Video Editing Skill - Setup"
echo "====================================="

echo "[1/4] Installing Node.js dependencies..."
npm install

echo "[2/4] Installing Frontend dependencies..."
cd frontend && npm install && cd ..

echo "[3/4] Setting up Python environment..."
python3 -m venv venv 2>/dev/null || python -m venv venv 2>/dev/null
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
pip install openai-whisper scenedetect[opencv] openai pyannote.audio 2>/dev/null

echo "[4/4] Checking FFmpeg..."
if command -v ffmpeg &>/dev/null; then
    echo "FFmpeg found: "
else
    echo "WARNING: FFmpeg not found. Install it:"
    echo "  macOS:  brew install ffmpeg"
    echo "  Ubuntu: sudo apt install ffmpeg"
    echo "  Windows: choco install ffmpeg"
fi

echo ""
echo "Setup complete!"
echo "  Start Remotion Studio: npm run dev"
echo "  Start Frontend:        npm run frontend"
