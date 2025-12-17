# System Architecture

## Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │   Flask     │ ◄─────► │   yt-dlp    │
│  (PWA UI)   │  REST   │   Backend   │         │   Engine    │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │
      │                        │
      ▼                        ▼
┌─────────────┐         ┌─────────────┐
│   Service   │         │  Downloads  │
│   Worker    │         │   Folder    │
└─────────────┘         └─────────────┘
```

## Component Breakdown

### Frontend (PWA)
- **index.html**: Single-page structure
- **app.js**: State management, API calls, UI logic
- **styles.css**: Responsive dark theme
- **sw.js**: Service worker for offline capability
- **manifest.json**: PWA configuration

### Backend (Flask)
- **app.py**: Main server with 3 endpoints
  - `/api/info`: Fetch video metadata
  - `/api/download`: Process download request
  - `/api/file/<filename>`: Serve downloaded file
- **config.py**: Centralized configuration
- **downloads/**: Temporary file storage

### Core Engine (yt-dlp)
- Video extraction and download
- Format selection
- Audio extraction with FFmpeg
- Automatic quality negotiation

## Data Flow

### 1. Video Info Request
```
User Input → Frontend validates → POST /api/info
→ yt-dlp extracts metadata → Returns formats/title/thumbnail
→ Frontend displays options
```

### 2. Download Request
```
User selects format/quality → POST /api/download
→ yt-dlp downloads with specified options
→ File saved with UUID → Returns file_id
→ Frontend triggers download via /api/file/<filename>
```

### 3. File Cleanup
```
Background thread runs every hour
→ Checks file age → Deletes files older than 1 hour
→ Prevents disk space issues
```

## Security Considerations

- CORS configured for cross-origin requests
- UUID-based filenames prevent path traversal
- File existence validation before serving
- Automatic cleanup prevents storage abuse
- Input validation on all endpoints

## Scalability Points

1. **Caching**: Add Redis for video metadata
2. **Queue**: Use Celery for async downloads
3. **Storage**: Move to S3/Cloud Storage
4. **CDN**: Serve frontend from CDN
5. **Load Balancing**: Multiple backend instances

## Future-Proofing

### yt-dlp Updates
- Regular updates via `pip install --upgrade yt-dlp`
- No hard-coded format strings
- Dynamic format detection from API

### API Versioning
- Current: `/api/...`
- Future: `/api/v2/...` for breaking changes

### Configuration
- All settings in config.py
- Environment variable overrides
- No magic numbers in code

## Performance Optimizations

- Streaming file downloads (no memory buffering)
- Parallel format detection
- Minimal dependencies
- Efficient file I/O
- Background cleanup thread

## Error Handling

- Try-catch on all API endpoints
- Descriptive error messages
- HTTP status codes
- Frontend error display
- Graceful degradation
