# YouTube Video Downloader - PWA

A lightweight, high-performance YouTube video downloader built as a Progressive Web App.

## Features

- Download YouTube videos in MP4 format (144p, 360p, 720p, 1080p)
- Extract audio as MP3
- Modern, responsive UI with dark mode
- PWA - installable on mobile and desktop
- Fast processing with yt-dlp
- Automatic file cleanup

## Tech Stack

- **Backend**: Python, Flask, yt-dlp
- **Frontend**: HTML, CSS, JavaScript
- **PWA**: Service Worker, Manifest

## Installation

### Prerequisites

- Python 3.8+
- FFmpeg (required for audio extraction)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Serve with any static server:
```bash
python -m http.server 8000
```

Or use Live Server extension in VS Code.

Frontend runs on `http://localhost:8000`

## Usage

1. Open the app in your browser
2. Paste a YouTube URL
3. Click "Get Video"
4. Select format (MP4/MP3) and quality
5. Click "Download"

## Deployment

### Local Network

Update `API_URL` in `frontend/js/app.js` to your local IP:
```javascript
const API_URL = 'http://192.168.1.x:5000/api';
```

### Production Server

1. Use Gunicorn for backend:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. Serve frontend with Nginx/Apache
3. Update API_URL to production domain
4. Enable HTTPS for PWA features

## Maintenance

### Update yt-dlp

```bash
pip install --upgrade yt-dlp
```

### Clear download cache

Files auto-delete after 1 hour. Manual cleanup:
```bash
rm -rf backend/downloads/*
```

## Troubleshooting

**FFmpeg not found**: Install FFmpeg and add to PATH
**CORS errors**: Check Flask-CORS configuration
**Download fails**: Update yt-dlp to latest version

## License

MIT
