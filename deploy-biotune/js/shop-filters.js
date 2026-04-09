/**
 * Shop Filters for BioTune
 * Price range, sorting, and availability filtering
 */

class ShopFilters {
    constructor() {
        this.container = document.getElementById('shop-filters');
        this.productsGrid = document.getElementById('product-grid');
        this.products = [];

        // Filter state
        this.filters = {
            minPrice: 0,
            maxPrice: 1000,
            sortBy: 'default', // 'default', 'price-asc', 'price-desc'
            showOnlyAvailable: false
        };

        if (this.container && this.productsGrid) {
            this.waitForProducts();
        }
    }

    waitForProducts() {
        // Wait for productsData to be available
        const checkProducts = () => {
            if (window.productsData && window.productsData.length > 0) {
                this.products = window.productsData;
                this.init();
            } else {
                // Check again in 50ms
                setTimeout(checkProducts, 50);
            }
        };
        checkProducts();
    }

    init() {
        // Calculate price range from products
        if (this.products.length > 0) {
            const prices = this.products.map(p => p.price);
            this.filters.minPrice = Math.floor(Math.min(...prices));
            this.filters.maxPrice = Math.ceil(Math.max(...prices));
        }

        this.renderFilters();
        this.bindEvents();
    }

    renderFilters() {
        const minPrice = this.filters.minPrice;
        const maxPrice = this.filters.maxPrice;

        this.container.innerHTML = `
            <div class="filters-wrapper">
                <div class="filter-group">
                    <label class="filter-label">Cena (PLN)</label>
                    <div class="price-range">
                        <input type="number" id="price-min" class="price-input" 
                               value="${minPrice}" min="${minPrice}" max="${maxPrice}">
                        <span class="price-separator">-</span>
                        <input type="number" id="price-max" class="price-input" 
                               value="${maxPrice}" min="${minPrice}" max="${maxPrice}">
                    </div>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Sortuj</label>
                    <div class="sort-options">
                        <label class="radio-label">
                            <input type="radio" name="sort" value="price-asc">
                            <span>Od najniższej</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="sort" value="price-desc">
                            <span>Od najwyższej</span>
                        </label>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="only-available">
                        <span>Tylko dostępne</span>
                    </label>
                </div>
                
                <button id="apply-filters" class="filter-button">Filtruj</button>
                <button id="reset-filters" class="filter-button secondary">Resetuj</button>
            </div>
        `;
    }

    bindEvents() {
        const applyBtn = document.getElementById('apply-filters');
        const resetBtn = document.getElementById('reset-filters');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }

    applyFilters() {
        const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
        const maxPrice = parseFloat(document.getElementById('price-max').value) || 1000;
        const sortRadio = document.querySelector('input[name="sort"]:checked');
        const sortBy = sortRadio ? sortRadio.value : 'default';
        const onlyAvailable = document.getElementById('only-available').checked;

        this.filters = { minPrice, maxPrice, sortBy, showOnlyAvailable: onlyAvailable };

        let filtered = this.products.filter(p => {
            if (p.price < minPrice || p.price > maxPrice) return false;
            if (onlyAvailable && p.stock <= 0) return false;
            return true;
        });

        // Sort
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        // Re-render grid using custom filtered products
        this.renderFilteredGrid(filtered);
    }

    renderFilteredGrid(products) {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center text-gray-500 py-10">Nie znaleziono produktów pasujących do wybranych filtrów.</div>`;
            return;
        }

        grid.innerHTML = products.map((product, index) => {
            const imgSrc = product.images && product.images[0] ? product.images[0] : './assets/product-placeholder.svg';

            return `
            <div class="product-card-wrapper relative cursor-pointer" 
                 style="animation-delay: ${index * 50}ms"
                 onclick="handleCardClick(event, '${product.id}')">
                
                <!-- Snake border segments with rounded corners -->
                <span class="snake-border snake-border-top"></span>
                <span class="snake-border snake-border-right"></span>
                <span class="snake-border snake-border-bottom"></span>
                <span class="snake-border snake-border-left"></span>
                <!-- Corner pieces for rounded effect -->
                <span class="snake-corner snake-corner-tl"></span>
                <span class="snake-corner snake-corner-tr"></span>
                <span class="snake-corner snake-corner-br"></span>
                <span class="snake-corner snake-corner-bl"></span>
                
                <div class="bg-[#151515] shadow-lg hover:shadow-2xl p-4 rounded-xl relative group product-card transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    
                    <div class="aspect-square bg-black/50 rounded-lg mb-4 overflow-hidden border border-white/5 relative">
                        <img src="${imgSrc}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <!-- Darkened overlay with product name -->
                        <div class="product-overlay absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 transition-opacity duration-300">
                            <span class="product-overlay-name text-biotune-red font-bold text-xl text-center px-4">${product.name}</span>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="flex justify-between items-start gap-4">
                            <h3 class="text-lg font-bold text-white group-hover:text-biotune-red transition-colors leading-tight flex-1">${product.name}</h3>
                            <span class="font-mono text-biotune-red font-bold text-lg whitespace-nowrap">${product.price.toFixed(2)} zł</span>
                        </div>
                        <p class="text-sm text-gray-400 mt-1">${product.dosage || ''}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}">
                            ${product.stock > 0 ? '● Dostępny' : '● Niedostępny'}
                        </span>
                        <button class="text-xs text-gray-400 hover:text-biotune-red transition-colors" 
                                onclick="event.stopPropagation(); window.open('product.html?id=${product.id}', '_self')">
                            Zobacz szczegóły →
                        </button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    resetFilters() {
        if (this.products.length > 0) {
            const prices = this.products.map(p => p.price);
            document.getElementById('price-min').value = Math.floor(Math.min(...prices));
            document.getElementById('price-max').value = Math.ceil(Math.max(...prices));
        }

        document.querySelectorAll('input[name="sort"]').forEach(r => r.checked = false);
        document.getElementById('only-available').checked = false;

        // Show all products
        if (window.initShop) {
            window.initShop();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shopFilters = new ShopFilters();
});
