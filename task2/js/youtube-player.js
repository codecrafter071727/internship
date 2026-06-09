// Handles YouTube IFrame API loading and player management

let apiLoaded = false;
const callbacks = [];

export const loadYouTubeAPI = () => {
    if (apiLoaded) return Promise.resolve();
    
    return new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            apiLoaded = true;
            resolve();
        };
    });
};

export const createPlayer = (elementId, videoId, onStateChange) => {
    return new Promise((resolve) => {
        const player = new YT.Player(elementId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'rel': 0,
                'modestbranding': 1
            },
            events: {
                'onReady': () => resolve(player),
                'onStateChange': onStateChange
            }
        });
    });
};
