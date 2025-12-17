# Quick Start Guide

## 5-Minute Setup

### Step 1: Install FFmpeg
**Windows:**
```bash
# Download from https://ffmpeg.org/download.html
# Add to PATH
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### Step 2: Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
python app.py
```

### Step 3: Frontend
```bash
cd frontend
python -m http.server 8000
```

### Step 4: Open Browser
Navigate to: `http://localhost:8000`

## Test It

1. Paste: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. Click "Get Video"
3. Select MP4 or MP3
4. Choose quality
5. Click "Download"

## Install as PWA

### Desktop (Chrome/Edge)
- Click install icon in address bar
- Or: Menu → Install YT Downloader

### Mobile (Android)
- Menu → Add to Home Screen
- App appears on home screen

### Mobile (iOS)
- Safari → Share → Add to Home Screen

## Troubleshooting

**Backend won't start:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**FFmpeg error:**
- Ensure FFmpeg is installed and in PATH
- Test: `ffmpeg -version`

**CORS error:**
- Check API_URL in `frontend/js/app.js`
- Should match backend address

**Download fails:**
```bash
pip install --upgrade yt-dlp
```

## Next Steps

- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Generate proper icons (see [ICONS.md](ICONS.md))
