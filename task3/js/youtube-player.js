// Handles YouTube player and watch time tracking

let watchTime = 0;
let timer = null;
let player = null;

export const initPlayer = (videoId, onTargetReached) => {
    // Load YT API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: videoId,
            events: {
                'onStateChange': (e) => {
                    if (e.data === YT.PlayerState.PLAYING) {
                        startTimer(onTargetReached);
                    } else {
                        stopTimer();
                    }
                }
            }
        });
    };
};

const startTimer = (callback) => {
    if (timer) return;
    
    timer = setInterval(() => {
        watchTime += 0.5;
        if (watchTime >= 6) {
            stopTimer();
            callback();
        }
    }, 500);
};

const stopTimer = () => {
    clearInterval(timer);
    timer = null;
};
