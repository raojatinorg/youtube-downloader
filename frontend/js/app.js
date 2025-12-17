const API_URL = 'http://localhost:5000/api';

const state = {
    url: '',
    videoInfo: null,
    selectedFormat: 'mp4',
    selectedQuality: '720'
};

const urlInput = document.getElementById('url-input');
const fetchBtn = document.getElementById('fetch-btn');
const downloadBtn = document.getElementById('download-btn');
const backBtn = document.getElementById('back-btn');
const errorMsg = document.getElementById('error-msg');
const thumbnail = document.getElementById('thumbnail');
const videoTitle = document.getElementById('video-title');
const qualityOptions = document.getElementById('quality-options');
const qualityGroup = document.getElementById('quality-group');

const stepUrl = document.getElementById('step-url');
const stepOptions = document.getElementById('step-options');
const stepDownloading = document.getElementById('step-downloading');

fetchBtn.addEventListener('click', fetchVideoInfo);
downloadBtn.addEventListener('click', startDownload);
backBtn.addEventListener('click', reset);

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchVideoInfo();
});

document.querySelectorAll('.btn-option[data-format]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-option[data-format]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.selectedFormat = e.target.dataset.format;
        
        if (state.selectedFormat === 'mp3') {
            qualityGroup.style.display = 'none';
        } else {
            qualityGroup.style.display = 'block';
        }
    });
});

async function fetchVideoInfo() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a YouTube URL');
        return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        showError('Please enter a valid YouTube URL');
        return;
    }

    state.url = url;
    hideError();
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Loading...';

    try {
        const response = await fetch(`${API_URL}/info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch video info');
        }

        state.videoInfo = data;
        displayVideoInfo(data);
        showStep('options');
    } catch (error) {
        showError(error.message);
    } finally {
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Get Video';
    }
}

function displayVideoInfo(info) {
    thumbnail.src = info.thumbnail;
    videoTitle.textContent = info.title;

    qualityOptions.innerHTML = '';
    const qualities = ['144', '360', '720', '1080'];
    const availableQualities = qualities.filter(q => info.formats.includes(parseInt(q)));

    if (availableQualities.length === 0) {
        availableQualities.push('720');
    }

    availableQualities.forEach((q, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = `${q}p`;
        btn.dataset.quality = q;
        if (index === availableQualities.length - 1) btn.classList.add('active');
        
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#quality-options .btn-option').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.selectedQuality = e.target.dataset.quality;
        });
        
        qualityOptions.appendChild(btn);
    });

    state.selectedQuality = availableQualities[availableQualities.length - 1];
}

async function startDownload() {
    showStep('downloading');

    try {
        const response = await fetch(`${API_URL}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: state.url,
                format: state.selectedFormat,
                quality: state.selectedQuality
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Download failed');
        }

        const fileUrl = `${API_URL}/file/${data.filename}`;
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
            reset();
            showError('Download started! Check your downloads folder.', 'success');
        }, 1000);
    } catch (error) {
        showStep('options');
        showError(error.message);
    }
}

function showStep(step) {
    stepUrl.classList.remove('active');
    stepOptions.classList.remove('active');
    stepDownloading.classList.remove('active');

    if (step === 'url') stepUrl.classList.add('active');
    else if (step === 'options') stepOptions.classList.add('active');
    else if (step === 'downloading') stepDownloading.classList.add('active');
}

function showError(message, type = 'error') {
    errorMsg.textContent = message;
    errorMsg.className = type === 'success' ? 'error show' : 'error show';
    errorMsg.style.color = type === 'success' ? 'var(--success)' : 'var(--error)';
}

function hideError() {
    errorMsg.classList.remove('show');
}

function reset() {
    state.url = '';
    state.videoInfo = null;
    state.selectedFormat = 'mp4';
    state.selectedQuality = '720';
    urlInput.value = '';
    hideError();
    showStep('url');
    qualityGroup.style.display = 'block';
}
