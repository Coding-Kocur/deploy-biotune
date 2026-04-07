/**
 * Hero Carousel for BioTune
 * Auto-rotating image carousel with progress bar indicators
 */

class HeroCarousel {
    constructor() {
        this.carousel = document.getElementById('hero-carousel');
        this.progressContainer = document.getElementById('carousel-progress');

        if (!this.carousel || !this.progressContainer) return;

        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.progressBars = this.progressContainer.querySelectorAll('.progress-bar');
        this.currentSlide = 0;
        this.slideInterval = 5000; // 5 seconds per slide
        this.progressInterval = null;
        this.autoplayTimer = null;

        this.init();
    }

    init() {
        // Set up click handlers for progress bars
        this.progressBars.forEach((bar, index) => {
            bar.addEventListener('click', () => this.goToSlide(index));
        });

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));

        // Reset ALL progress bars instantly (no transition)
        this.progressBars.forEach(bar => {
            bar.classList.remove('active', 'completed');
            const fill = bar.querySelector('.progress-fill');
            fill.style.transition = 'none'; // Disable transition for instant reset
            fill.style.width = '0%';
        });

        // Mark previous slides as completed (instantly full)
        for (let i = 0; i < index; i++) {
            this.progressBars[i].classList.add('completed');
            const fill = this.progressBars[i].querySelector('.progress-fill');
            fill.style.transition = 'none';
            fill.style.width = '100%';
        }

        // Force reflow to ensure CSS accepts the instant changes before next frame
        this.progressContainer.offsetHeight;

        // Activate current slide and start animation
        this.currentSlide = index;
        this.slides[index].classList.add('active');
        this.progressBars[index].classList.add('active');

        this.animateProgress();
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }

    animateProgress() {
        const progressFill = this.progressBars[this.currentSlide].querySelector('.progress-fill');
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';

        // Force reflow
        progressFill.offsetHeight;

        progressFill.style.transition = `width ${this.slideInterval}ms linear`;
        progressFill.style.width = '100%';
    }

    startAutoplay() {
        this.pauseAutoplay();
        this.animateProgress();
        this.autoplayTimer = setInterval(() => this.nextSlide(), this.slideInterval);
    }

    pauseAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroCarousel = new HeroCarousel();
});
