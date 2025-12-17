from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import uuid
import threading
import time

app = Flask(__name__)
CORS(app)

DOWNLOAD_DIR = 'downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def cleanup_old_files():
    while True:
        time.sleep(3600)
        now = time.time()
        for f in os.listdir(DOWNLOAD_DIR):
            path = os.path.join(DOWNLOAD_DIR, f)
            if os.path.isfile(path) and now - os.path.getmtime(path) > 3600:
                os.remove(path)

threading.Thread(target=cleanup_old_files, daemon=True).start()

@app.route('/api/info', methods=['POST'])
def get_video_info():
    try:
        url = request.json.get('url')
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        ydl_opts = {'quiet': True, 'no_warnings': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = []
            seen = set()
            for f in info.get('formats', []):
                height = f.get('height')
                if height and height not in seen and f.get('vcodec') != 'none':
                    seen.add(height)
                    formats.append(height)
            
            return jsonify({
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'formats': sorted(list(seen))
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/download', methods=['POST'])
def download_video():
    try:
        data = request.json
        url = data.get('url')
        format_type = data.get('format', 'mp4')
        quality = data.get('quality', '720')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        file_id = str(uuid.uuid4())
        
        if format_type == 'mp3':
            output_path = os.path.join(DOWNLOAD_DIR, f'{file_id}.mp3')
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': output_path,
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'quiet': True
            }
        else:
            output_path = os.path.join(DOWNLOAD_DIR, f'{file_id}.mp4')
            format_str = f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]'
            ydl_opts = {
                'format': format_str,
                'outtmpl': output_path,
                'merge_output_format': 'mp4',
                'quiet': True
            }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        actual_file = None
        for f in os.listdir(DOWNLOAD_DIR):
            if f.startswith(file_id):
                actual_file = f
                break

        if not actual_file:
            return jsonify({'error': 'Download failed'}), 500

        return jsonify({
            'file_id': file_id,
            'filename': actual_file
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/file/<filename>', methods=['GET'])
def get_file(filename):
    try:
        file_path = os.path.join(DOWNLOAD_DIR, filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
