Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Video Editing Skill - Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "
[1/4] Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

Write-Host "
[2/4] Installing Frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "
[3/4] Setting up Python environment..." -ForegroundColor Yellow
try {
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    pip install openai-whisper scenedetect[opencv] openai
} catch {
    Write-Host "Python venv setup skipped (install Python 3.10+ manually)" -ForegroundColor Red
}

Write-Host "
[4/4] Checking FFmpeg..." -ForegroundColor Yellow
try {
    ffmpeg -version | Select-Object -First 1
    Write-Host "FFmpeg found!" -ForegroundColor Green
} catch {
    Write-Host "FFmpeg not found. Install: choco install ffmpeg" -ForegroundColor Red
}

Write-Host "
Setup complete!" -ForegroundColor Green
Write-Host "  Start Remotion Studio: npm run dev"
Write-Host "  Start Frontend:        npm run frontend"
