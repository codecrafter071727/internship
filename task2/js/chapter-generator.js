// Simulates AI chapter generation for any YouTube URL

export const initGenerator = (onChaptersGenerated) => {
    const btn = document.getElementById('generate-btn');
    const input = document.getElementById('yt-url');
    const errorMsg = document.getElementById('error-msg');
    const loading = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const resultArea = document.getElementById('generator-result');

    btn.onclick = async () => {
        const url = input.value.trim();
        const videoId = extractVideoId(url);

        if (!videoId) {
            showError('Please enter a valid YouTube URL');
            return;
        }

        // Reset UI
        errorMsg.classList.add('hidden');
        emptyState.classList.add('hidden');
        resultArea.classList.add('hidden');
        loading.classList.remove('hidden');

        // Simulate "AI" processing time
        await new Promise(r => setTimeout(r, 2000));

        const generatedChapters = [
            { time: 0, title: "Introduction & Hook" },
            { time: 135, title: "Core Concepts Breakdown" },
            { time: 330, title: "Real-world Application" },
            { time: 480, title: "Advanced Optimization" },
            { time: 645, title: "Conclusion & Summary" }
        ];

        loading.classList.add('hidden');
        resultArea.classList.remove('hidden');
        
        onChaptersGenerated(videoId, generatedChapters);
    };

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }
};

function extractVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
