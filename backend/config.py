import os

class Config:
    # Server
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    
    # Downloads
    DOWNLOAD_DIR = os.getenv('DOWNLOAD_DIR', 'downloads')
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 500 * 1024 * 1024))  # 500MB
    CLEANUP_INTERVAL = int(os.getenv('CLEANUP_INTERVAL', 3600))  # 1 hour
    FILE_RETENTION = int(os.getenv('FILE_RETENTION', 3600))  # 1 hour
    
    # yt-dlp
    YDL_QUIET = True
    YDL_NO_WARNINGS = True
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
