const VIDEO_ID = 'RJTCAL1DRro';

let watchTime = 0;
let timer = null;
let player = null;
let leadPromptShown = false;
let playerReady = false;

function saveLead(data) {
    const leads = getLeads();
    leads.push({ ...data, date: new Date().toLocaleString() });
    localStorage.setItem('leads', JSON.stringify(leads));
}

function getLeads() {
    const data = localStorage.getItem('leads');
    return data ? JSON.parse(data) : [];
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function startTimer(callback) {
    if (timer) return;

    timer = setInterval(() => {
        watchTime += 0.5;
        if (watchTime >= 6) {
            stopTimer();
            callback();
        }
    }, 500);
}

function initPlayer(videoId, onTargetReached) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId,
            playerVars: {
                enablejsapi: 1,
                origin: window.location.origin,
                playsinline: 1,
                controls: 1,
                rel: 0,
                modestbranding: 1
            },
            events: {
                onReady: () => {
                    playerReady = true;
                },
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        startTimer(onTargetReached);
                        const mobilePlayButton = document.getElementById('mobile-play-btn');
                        if (mobilePlayButton) {
                            mobilePlayButton.classList.add('hidden');
                        }
                    } else {
                        stopTimer();
                    }
                }
            }
        });
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('lead-modal');
    const form = document.getElementById('lead-form');
    const successMessage = document.getElementById('success-message');
    const mobilePlayButton = document.getElementById('mobile-play-btn');

    document.querySelectorAll('[data-close]').forEach((button) => {
        button.onclick = () => modal.classList.remove('active');
    });

    form.onsubmit = (event) => {
        event.preventDefault();

        let isValid = true;
        const inputs = form.querySelectorAll('input');

        inputs.forEach((input) => {
            const error = document.getElementById(`${input.id}-error`);
            if (!input.value.trim()) {
                error.textContent = 'This field is required';
                isValid = false;
            } else {
                error.textContent = '';
            }
        });

        if (!isValid) return;

        const data = Object.fromEntries(new FormData(form));
        saveLead(data);

        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('active'), 3000);
    };

    mobilePlayButton.onclick = () => {
        if (playerReady && player && typeof player.playVideo === 'function') {
            player.playVideo();
        } else {
            window.open(`https://www.youtube.com/watch?v=${VIDEO_ID}`, '_blank');
        }
    };

    initPlayer(VIDEO_ID, () => {
        if (!leadPromptShown) {
            leadPromptShown = true;
            modal.classList.add('active');
        }
    });
});
