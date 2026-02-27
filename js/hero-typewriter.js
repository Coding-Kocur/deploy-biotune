/**
 * Typewriter Animation for Hero Page
 * Displays 3 phrases sequentially, each staying visible after animation
 */

class HeroTypewriter {
    constructor() {
        this.container = document.getElementById('hero-taglines');
        this.phrases = [
            "Precyzja w każdym miligramie",
            "Czystość potwierdzona badaniami",
            "Jakość bez kompromisów"
        ];
        this.currentPhrase = 0;
        this.typingSpeed = 50;
        this.pauseBetweenPhrases = 800;

        if (this.container) {
            this.init();
        }
    }

    init() {
        // Create elements for each phrase
        this.phrases.forEach((_, index) => {
            const line = document.createElement('p');
            line.className = 'tagline-text';
            line.id = `tagline-${index}`;
            this.container.appendChild(line);
        });

        // Start typing after a delay
        setTimeout(() => this.typePhrase(0), 500);
    }

    typePhrase(phraseIndex) {
        if (phraseIndex >= this.phrases.length) return;

        const phrase = this.phrases[phraseIndex];
        const element = document.getElementById(`tagline-${phraseIndex}`);
        let charIndex = 0;

        element.classList.add('typing');

        const typeChar = () => {
            if (charIndex < phrase.length) {
                element.textContent = phrase.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeChar, this.typingSpeed);
            } else {
                // Done typing this phrase
                element.classList.remove('typing');
                element.classList.add('complete');

                // Type next phrase after pause
                if (phraseIndex < this.phrases.length - 1) {
                    setTimeout(() => {
                        this.typePhrase(phraseIndex + 1);
                    }, this.pauseBetweenPhrases);
                }
            }
        };

        typeChar();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroTypewriter = new HeroTypewriter();
});
