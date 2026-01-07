function initShop() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    renderGrid(searchQuery);
}

function renderGrid(filterText = '') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const products = window.productsData || [];

    const filteredProducts = products.filter(p =>
        p && p.name && p.name.toLowerCase().includes((filterText || '').toLowerCase())
    );

    if (filteredProducts.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center text-gray-500 py-10">Nie znaleziono produktów pasujących do "${filterText}".</div>`;
        return;
    }

    grid.innerHTML = filteredProducts.map((product, index) => {
        const imgSrc = product.images && product.images[0] ? product.images[0] : './assets/product-placeholder.svg';

        return `
        <div class="product-card-wrapper relative cursor-pointer" 
             style="animation-delay: ${index * 50}ms"
             onclick="handleCardClick(event, '${product.id}')">
            <!-- Animated SVG border -->
            <svg class="animated-border-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect class="animated-border-rect" x="0.5" y="0.5" width="99" height="99" rx="6" ry="6" vector-effect="non-scaling-stroke"/>
            </svg>
            
            <div class="bg-[#151515] shadow-lg hover:shadow-2xl p-4 rounded-xl relative group product-card transition-all duration-300 hover:-translate-y-1">
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
                <div class="flex gap-2 mt-4">
                    <button onclick="handleGridAddToCart(event, '${product.id}')" class="flex-1 bg-biotune-red hover:bg-red-600 text-white font-bold py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        DODAJ
                    </button>
                    <button onclick="handleGridToggleWishlist(event, '${product.id}')" class="px-3 bg-white/5 hover:text-biotune-red border border-white/10 text-gray-400 rounded-lg transition-all duration-300 flex items-center justify-center hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Animate cards in
    animateCards();
}

// Handle card click - navigate to product page except when clicking add to cart button
function handleCardClick(event, productId) {
    // Don't navigate if clicking the add to cart button or its children
    if (event.target.closest('button')) {
        return;
    }

    window.location.href = `product.html?id=${productId}`;
}

// Handle add to cart button - stop propagation to prevent card click
function handleGridAddToCart(event, productId) {
    // Stop event from bubbling to card
    event.stopPropagation();

    const product = window.productsData.find(p => p.id === productId);
    if (product && window.addToCart) {
        window.addToCart(product);
    }
}

function filterShop(query) {
    renderGrid(query);
}

function animateCards() {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo('.product-card',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    } else {
        // Fallback if GSAP not loaded
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.opacity = '1';
        });
    }
}

// Handle wishlist toggle in grid
function handleGridToggleWishlist(event, productId) {
    event.stopPropagation();
    if (window.wishlistManager) {
        const added = window.wishlistManager.toggle(productId);
        const btn = event.currentTarget;
        if (added) {
            btn.classList.add('text-biotune-red');
            btn.querySelector('svg').setAttribute('fill', 'currentColor');
        } else {
            btn.classList.remove('text-biotune-red');
            btn.querySelector('svg').setAttribute('fill', 'none');
        }
    }
}

// Expose functions globally
window.initShop = initShop;
window.filterShop = filterShop;
window.handleCardClick = handleCardClick;
window.handleGridAddToCart = handleGridAddToCart;
window.handleGridToggleWishlist = handleGridToggleWishlist;
