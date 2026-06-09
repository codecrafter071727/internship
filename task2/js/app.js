import { loadYouTubeAPI, createPlayer } from './youtube-player.js';
import { VideoCarousel } from './carousel.js';
import { renderChapters, updateActiveChapter } from './chapters.js';
import { initGenerator } from './chapter-generator.js';

const VIDEOS = [
    {
        id: 'RJTCAL1DRro',
        title: 'Modern Web Development',
        chapters: [
            { time: 0, title: 'Introduction' },
            { time: 45, title: 'Architecture Setup' },
            { time: 120, title: 'Component Design' },
            { time: 200, title: 'Final Review' }
        ]
    },
    {
        id: 'jj_aUFX8SV8',
        title: 'Mastering JavaScript',
        chapters: [
            { time: 0, title: 'Welcome' },
            { time: 60, title: 'Advanced Scoping' },
            { time: 180, title: 'Async Patterns' },
            { time: 300, title: 'Performance' }
        ]
    },
    {
        id: 'xmmxkmVSiq0',
        title: 'UI/UX Principles',
        chapters: [
            { time: 0, title: 'Overview' },
            { time: 90, title: 'Color Theory' },
            { time: 210, title: 'Typography' },
            { time: 350, title: 'Final Summary' }
        ]
    }
];

let mainPlayer = null;
let previewPlayer = null;
let trackingInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadYouTubeAPI();

    // 1. Setup Carousel
    const carousel = new VideoCarousel(VIDEOS, (video) => {
        if (mainPlayer) {
            mainPlayer.loadVideoById(video.id);
            renderChapters('chapters-list', video.chapters, (time) => mainPlayer.seekTo(time));
        }
    });

    // 2. Initial Player Setup
    const initialVideo = carousel.getCurrentVideo();
    mainPlayer = await createPlayer('player', initialVideo.id, (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
            startTracking('chapters-list', mainPlayer);
        } else {
            stopTracking();
        }
    });

    renderChapters('chapters-list', initialVideo.chapters, (time) => mainPlayer.seekTo(time));

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
