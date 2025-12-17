# Deployment Guide

## Local Development

### Quick Start
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
cd frontend
python -m http.server 8000
```

Visit: `http://localhost:8000`

## Production Deployment

### Option 1: VPS (DigitalOcean, AWS EC2, Linode)

#### Backend
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv ffmpeg nginx

# Setup app
cd /var/www/yt-downloader/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 127.0.0.1:5000 app:app --daemon
```

#### Frontend with Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/yt-downloader/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Docker

Create `Dockerfile` in backend:
```dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend/downloads:/app/downloads
  
  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
```

Run: `docker-compose up -d`

### Option 3: Heroku

Backend `Procfile`:
```
web: gunicorn app:app
```

Deploy:
```bash
heroku create yt-downloader-api
git push heroku main
```

## Environment Configuration

Create `.env` file:
```
FLASK_ENV=production
MAX_DOWNLOAD_SIZE=500MB
CLEANUP_INTERVAL=3600
```

Update `app.py` to load from env:
```python
from dotenv import load_dotenv
load_dotenv()
```

## Security Checklist

- [ ] Enable HTTPS
- [ ] Set CORS to specific domain
- [ ] Add rate limiting
- [ ] Implement file size limits
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets

## Monitoring

Add logging:
```python
import logging
logging.basicConfig(level=logging.INFO)
```

## Scaling

- Use Redis for caching video info
- Implement queue system (Celery) for downloads
- Use CDN for frontend assets
- Load balance multiple backend instances

## Maintenance

### Auto-update yt-dlp
```bash
# Add to crontab
0 0 * * * /path/to/venv/bin/pip install --upgrade yt-dlp
```

### Backup
```bash
# Backup downloads folder
tar -czf downloads-backup.tar.gz backend/downloads/
```
