/**
 * Newsletter Component for BioTune
 */

class Newsletter {
    constructor() {
        this.containers = document.querySelectorAll('.newsletter-section');
        this.init();
    }

    init() {
        this.containers.forEach(container => {
            const form = container.querySelector('.newsletter-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleSubmit(e, container));
            }
        });
    }

    handleSubmit(e, container) {
        e.preventDefault();

        const emailInput = container.querySelector('input[type="email"]');
        const checkbox = container.querySelector('input[type="checkbox"]');
        const feedback = container.querySelector('.newsletter-feedback');

        // Validate email
        if (!emailInput.value || !this.isValidEmail(emailInput.value)) {
            this.showFeedback(feedback, 'Podaj prawidłowy adres email.', 'error');
            return;
        }

        // Validate consent
        if (checkbox && !checkbox.checked) {
            this.showFeedback(feedback, 'Musisz wyrazić zgodę na przetwarzanie danych.', 'error');
            return;
        }

        // Simulate subscription (in production, this would call an API)
        this.showFeedback(feedback, 'Dziękujemy za zapisanie się do newslettera!', 'success');
        emailInput.value = '';
        if (checkbox) checkbox.checked = false;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFeedback(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `newsletter-feedback ${type}`;
        element.style.display = 'block';

        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.newsletter = new Newsletter();
});
