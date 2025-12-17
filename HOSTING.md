# Free Hosting Guide

## Option 1: Render.com (Recommended)

1. **GitHub pe push karo**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. **Render.com pe jao**
   - https://render.com (Sign up free)
   - New → Web Service
   - Connect GitHub repo
   - Auto-detect krega

3. **Frontend (Netlify/Vercel)**
   - https://netlify.com
   - Drag & drop `frontend` folder
   - Update `API_URL` in `frontend/js/app.js`

## Option 2: Railway.app

1. **Railway pe jao**
   - https://railway.app
   - New Project → Deploy from GitHub
   - Select repo
   - Auto-deploy hoga

2. **Environment Variables**
   - PORT=5000
   - PYTHON_VERSION=3.11

## Option 3: PythonAnywhere

1. **Account banao**: https://pythonanywhere.com
2. **Upload files** via Files tab
3. **Web tab** → Add new web app
4. **WSGI file** edit karo:
```python
import sys
sys.path.insert(0, '/home/USERNAME/backend')
from app import app as application
```

## Option 4: Glitch.com

1. **Glitch pe jao**: https://glitch.com
2. **Import from GitHub**
3. **Auto-deploy**

## Frontend Only Hosting

**Netlify** (Best for frontend):
```bash
cd frontend
netlify deploy --prod
```

**Vercel**:
```bash
cd frontend
vercel --prod
```

**GitHub Pages**:
```bash
git subtree push --prefix frontend origin gh-pages
```

## Important: API_URL Update

Backend deploy hone ke baad, frontend me update karo:

`frontend/js/app.js`:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

## Free Tier Limits

- **Render**: 750 hours/month
- **Railway**: $5 credit/month
- **Vercel**: Unlimited frontend
- **Netlify**: 100GB bandwidth
- **PythonAnywhere**: 1 web app free

## Sabse Easy Method

1. Backend → **Render.com**
2. Frontend → **Netlify.com**
3. Total time: 10 minutes
