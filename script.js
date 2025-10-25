// Navigation data for the presentation
const slideData = [
    { index: 0, title: "Contents", file: "index.html" },
    { index: 1, title: "Early life", file: "early-life.html" },
    { index: 2, title: "9/11 Incident", file: "911-incident.html" },
    { index: 3, title: "Blasphemy", file: "blasphemy.html" },
    { index: 4, title: "Dissociation", file: "dissociation.html" },
    { index: 5, title: "Substance Abuse", file: "substance-abuse.html" },
    { index: 6, title: "Career", file: "career.html" },
    { index: 7, title: "Controversial Thoughts", file: "controversial-thoughts.html" },
    { index: 8, title: "Gender Chaos", file: "gender-chaos.html" },
    { index: 9, title: "Legacy", file: "legacy.html" }
];

// Get current slide index from filename
function getCurrentSlideIndex() {
    const filename = window.location.pathname.split('/').pop();
    const slide = slideData.find(s => s.file === filename);
    return slide ? slide.index : 0;
}

// Initialize the page
function initPage() {
    const currentIndex = getCurrentSlideIndex();
    const currentSlide = slideData[currentIndex];

    // Set page title
    document.title = currentSlide.title + ' — Wikipedia Presentation';

    // Update TOC
    syncSideToc(currentIndex);

    // Update HUD
    updateHUD(currentIndex);

    // Add title animation
    const titleElement = document.querySelector('.section-title');
    if (titleElement) {
        titleElement.classList.remove('title-enter');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => titleElement.classList.add('title-enter'));
        });
    }
}

// Sync sidebar TOC highlighting
function syncSideToc(currentIndex) {
    const tocRows = document.querySelectorAll('.side-toc .toc-row');
    tocRows.forEach((row, idx) => {
        row.classList.toggle('current', idx === currentIndex);
        row.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
    });
}

// Update HUD (page indicator)
function updateHUD(currentIndex) {
    const dots = document.querySelectorAll('[data-dot]');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
    });

    const counter = document.getElementById('counter');
    if (counter) {
        counter.textContent = `${currentIndex + 1} / ${slideData.length}`;
    }
}

// Navigation functions
function navigateToSlide(index) {
    if (index >= 0 && index < slideData.length) {
        window.location.href = slideData[index].file;
    }
}

function nextSlide() {
    const currentIndex = getCurrentSlideIndex();
    navigateToSlide(currentIndex + 1);
}

function prevSlide() {
    const currentIndex = getCurrentSlideIndex();
    navigateToSlide(currentIndex - 1);
}

// Zoom transition effect for contents page navigation
function navigateWithZoom(targetIndex, clickedElement) {
    const clone = document.createElement('div');
    clone.textContent = clickedElement.textContent;
    clone.className = 'zoom-transition';
    // Center the zoom effect on the page
    clone.style.top = '50%';
    clone.style.left = '50%';
    clone.style.transform = 'translate(-50%, -50%) scale(1)';
    document.body.appendChild(clone);

    clone.addEventListener('animationend', () => {
        clone.remove();
        navigateToSlide(targetIndex);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initPage();

    // Keyboard navigation
    window.addEventListener('keydown', e => {
        if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) {
            e.preventDefault();
            nextSlide();
        }
        if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) {
            e.preventDefault();
            prevSlide();
        }
    });

    // Sidebar TOC navigation
    const tocRows = document.querySelectorAll('.side-toc .toc-row');
    tocRows.forEach(row => {
        row.addEventListener('click', e => {
            const targetIndex = parseInt(row.dataset.index, 10);
            const clickedElement = row.querySelector('.item');
            navigateWithZoom(targetIndex, clickedElement);
        });
    });

    // Contents page TOC navigation with zoom effect
    const tocLinks = document.querySelectorAll('.toc li span[data-target]');
    tocLinks.forEach(span => {
        span.addEventListener('click', e => {
            e.stopPropagation();
            const targetIndex = parseInt(span.dataset.target);
            navigateWithZoom(targetIndex, span);
        });
    });
});