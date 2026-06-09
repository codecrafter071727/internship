// Manages chapter rendering and active state highlighting

export const renderChapters = (containerId, chapters, onChapterClick) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.className = 'chapter-item';
        li.dataset.time = chapter.time;
        li.dataset.index = index;
        
        li.innerHTML = `
            <span class="chapter-time">${formatTime(chapter.time)}</span>
            <span class="chapter-title">${chapter.title}</span>
        `;

        li.onclick = () => onChapterClick(chapter.time);
        container.appendChild(li);
    });
};

export const updateActiveChapter = (containerId, currentTime) => {
    const items = document.querySelectorAll(`#${containerId} .chapter-item`);
    let activeIndex = -1;

    items.forEach((item, index) => {
        const time = parseInt(item.dataset.time);
        if (currentTime >= time) {
            activeIndex = index;
        }
    });

    items.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
            // Scroll into view if needed
            if (index !== lastActiveIndex[containerId]) {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else {
            item.classList.remove('active');
        }
    });

    lastActiveIndex[containerId] = activeIndex;
};

// Track last active to avoid excessive scrolling
const lastActiveIndex = {};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
