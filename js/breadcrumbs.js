/**
 * Breadcrumbs System for BioTune
 * Generates breadcrumb navigation on non-homepage pages
 */

class Breadcrumbs {
    constructor() {
        this.container = document.getElementById('breadcrumbs');
        this.pageNames = {
            'shop.html': 'Sklep',
            'product.html': 'Produkt',
            'about.html': 'O nas',
            'login.html': 'Logowanie',
            'register.html': 'Rejestracja',
            'regulamin.html': 'Regulamin',
            'privacy.html': 'Polityka Prywatności'
        };

        if (this.container) {
            this.init();
        }
    }

    init() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';

        // Don't show breadcrumbs on homepage
        if (filename === 'index.html' || filename === '') {
            this.container.style.display = 'none';
            return;
        }

        this.render(filename);
    }

    render(filename) {
        let pageName = this.pageNames[filename] || 'Strona';

        // Special handling for product page
        if (filename === 'product.html') {
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('id');
            if (productId && window.productsData) {
                const product = window.productsData.find(p => p.id === productId);
                if (product) {
                    pageName = product.name;
                }
            }
        }

        this.container.innerHTML = `
            <nav class="breadcrumbs-nav">
                <a href="index.html" class="breadcrumb-link">Strona główna</a>
                <span class="breadcrumb-separator">/</span>
                ${filename === 'product.html' ? `
                    <a href="shop.html" class="breadcrumb-link">Sklep</a>
                    <span class="breadcrumb-separator">/</span>
                ` : ''}
                <span class="breadcrumb-current">${pageName}</span>
            </nav>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.breadcrumbs = new Breadcrumbs();
});
