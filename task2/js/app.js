import { loadYouTubeAPI, createPlayer } from './youtube-player.js';
import { VideoCarousel } from './carousel.js';
import { renderChapters, updateActiveChapter } from './chapters.js';
import { initGenerator } from './chapter-generator.js';

const VIDEOS = [
    {
        id: 'RJTCAL1DRro',
        title: 'L30 Penthouse | Pursuit of a Radical Rhapsody',
        chapters: [
            { time: 0, title: 'Opening View' },
            { time: 48, title: 'Arrival Experience' },
            { time: 132, title: 'Interior Highlights' },
            { time: 248, title: 'Final Walkthrough' }
        ]
    },
    {
        id: 'jj_aUFX8SV8',
        title: 'After the Rain | Total Environment',
        chapters: [
            { time: 0, title: 'Welcome' },
            { time: 42, title: 'Landscape Approach' },
            { time: 108, title: 'Design Details' },
            { time: 192, title: 'Closing Frames' }
        ]
    },
    {
        id: 'xmmxkmVSiq0',
        title: 'V40 Courtyard Homes | Total Environment',
        chapters: [
            { time: 0, title: 'Project Overview' },
            { time: 36, title: 'Facade Details' },
            { time: 88, title: 'Courtyard Spaces' },
            { time: 146, title: 'Closing View' }
        ]
    }
];

let mainPlayer = null;
let previewPlayer = null;
let trackingInterval = null;

function setMobileToggleState(isPlaying) {
    const button = document.getElementById('mobile-video-toggle');
    if (!button) return;

    button.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i><span>Pause Video</span>'
        : '<i class="fas fa-play"></i><span>Play Video</span>';
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadYouTubeAPI();

    const mobileToggleButton = document.getElementById('mobile-video-toggle');

    // 1. Setup Carousel
    const carousel = new VideoCarousel(VIDEOS, (video) => {
        if (mainPlayer) {
            mainPlayer.loadVideoById(video.id);
            renderChapters('chapters-list', video.chapters, (time) => mainPlayer.seekTo(time));
            setMobileToggleState(false);
        }
    });

    // 2. Initial Player Setup
    const initialVideo = carousel.getCurrentVideo();
    mainPlayer = await createPlayer('player', initialVideo.id, (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
            startTracking('chapters-list', mainPlayer);
            setMobileToggleState(true);
        } else {
            stopTracking();
            if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.CUED) {
                setMobileToggleState(false);
            }
        }
    });

    renderChapters('chapters-list', initialVideo.chapters, (time) => mainPlayer.seekTo(time));

    mobileToggleButton.onclick = () => {
        if (!mainPlayer || !mainPlayer.getPlayerState) return;

        const state = mainPlayer.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            mainPlayer.pauseVideo();
        } else {
            mainPlayer.playVideo();
        }
    };

    // 3. Setup Chapter Generator
    initGenerator(async (videoId, chapters) => {
        if (previewPlayer) {
            previewPlayer.loadVideoById(videoId);
        } else {
            previewPlayer = await createPlayer('preview-player', videoId, (e) => {
                if (e.data === YT.PlayerState.PLAYING) {
                    startTracking('generated-list', previewPlayer);
                } else {
                    stopTracking();
                }
            });
        }
        renderChapters('generated-list', chapters, (time) => previewPlayer.seekTo(time));
    });
});

function startTracking(listId, playerInstance) {
    stopTracking();
    trackingInterval = setInterval(() => {
        if (playerInstance && playerInstance.getCurrentTime) {
            updateActiveChapter(listId, playerInstance.getCurrentTime());
        }
    }, 500);
}

function stopTracking() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }
}
