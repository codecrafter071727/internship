// Logic for switching between videos in the carousel

export class VideoCarousel {
    constructor(videos, onVideoChange) {
        this.videos = videos;
        this.currentIndex = 0;
        this.onVideoChange = onVideoChange;
        this.setupControls();
    }

    setupControls() {
        document.getElementById('prev-btn').onclick = () => this.prev();
        document.getElementById('next-btn').onclick = () => this.next();
        this.updateUI();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.videos.length;
        this.update();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.update();
    }

    update() {
        this.updateUI();
        this.onVideoChange(this.videos[this.currentIndex]);
    }

    updateUI() {
        const video = this.videos[this.currentIndex];
        document.getElementById('video-title').textContent = video.title;
    }

    getCurrentVideo() {
        return this.videos[this.currentIndex];
    }
}
