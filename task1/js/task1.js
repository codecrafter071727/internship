// 3D Carousel Logic for Task 1

class CoverflowCarousel {
    constructor() {
        this.track = document.getElementById('carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.pagination = document.getElementById('pagination');
        
        this.currentIndex = 2;
        this.autoPlayDelay = 2800;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        // Create pagination dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === this.currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.pagination.appendChild(dot);
        });

        this.dots = Array.from(this.pagination.children);

        // Add button listeners
        this.nextBtn.addEventListener('click', () => {
            this.next();
            this.resetAutoPlay();
        });

        this.prevBtn.addEventListener('click', () => {
            this.prev();
            this.resetAutoPlay();
        });

        // Initial render
        this.updateSlides();
        this.startAutoPlay();
    }

    updateSlides() {
        const total = this.slides.length;
        
        this.slides.forEach((slide, index) => {
            const offset = (index - this.currentIndex + total) % total;

            if (offset === 0) {
                slide.className = 'card-slide active';
            } else if (offset === total - 1) {
                slide.className = 'card-slide prev-slide';
            } else if (offset === 1) {
                slide.className = 'card-slide next-slide';
            } else {
                slide.className = 'card-slide hidden-slide';
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlides();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlides();
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new CoverflowCarousel();
});
