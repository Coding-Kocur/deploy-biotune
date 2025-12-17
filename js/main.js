document.addEventListener('DOMContentLoaded', () => {
    window.cart = JSON.parse(localStorage.getItem('biotune_cart')) || [];
    updateCart();

    if (window.initShop) {
        window.initShop();
    }

    if (window.initAnimations) {
        window.initAnimations();
    }

    const cartTrigger = document.getElementById('cart-trigger');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');

    function openCart() {
        cartDrawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
        }, 10);
    }

    function closeCartDrawer() {
        cartDrawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }

    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartDrawer);
    }

    if (overlay) {
        overlay.addEventListener('click', closeCartDrawer);
    }

    // Checkout button handler
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Check if user is logged in
            if (window.authSystem && window.authSystem.isLoggedIn()) {
                // Determine redirect URL
                const isProductPage = window.location.pathname.includes('product.html');
                const products = window.productsData || [];
                const firstProduct = window.cart[0];

                // If cart has items, try to find a matching product page or default to first one
                if (firstProduct) {
                    // For demo purposes, we'll just alert success since we don't have a real checkout
                    alert('Przekierowanie do płatności...');
                } else {
                    alert('Twój koszyk jest pusty!');
                }
            } else {
                // User is not logged in - redirect to login
                window.location.href = 'login.html';
            }
        });
    }

    const searchInput = document.querySelector('input[placeholder="Szukaj..."]');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

                if (isIndex) {
                    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
                    if (window.filterShop) {
                        window.filterShop(query);
                    }
                } else {
                    window.location.href = `index.html?search=${encodeURIComponent(query)}#shop`;
                }
            }
        });
    }

    window.openCart = openCart;
});

function addToCart(product) {
    window.cart.push(product);
    localStorage.setItem('biotune_cart', JSON.stringify(window.cart));
    updateCart();
    window.openCart();
}

function removeFromCart(index) {
    window.cart.splice(index, 1);
    localStorage.setItem('biotune_cart', JSON.stringify(window.cart));
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartCount || !cartTotal) return;

    cartCount.innerText = window.cart.length;
    cartCount.classList.toggle('hidden', window.cart.length === 0);

    const total = window.cart.reduce((sum, item) => sum + (item.price || 0), 0);
    cartTotal.innerText = total.toFixed(2) + ' PLN';

    if (window.cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 mt-10">Twój koszyk jest pusty.</p>';
    } else {
        cartItems.innerHTML = window.cart.map((item, index) => `
            <div class="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                <div>
                    <a href="product.html?id=${item.id}" class="font-bold text-sm text-black dark:text-white hover:text-biotune-red transition-colors block">${item.name}</a>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${item.dosage || ''}</p>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-sm font-mono text-black dark:text-white">${(item.price || 0).toFixed(2)} zł</span>
                    <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCart = updateCart;

class WishlistManager {
    constructor() {
        this.storageKey = 'biotune_wishlist';
        this.wishlist = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        this.updateUI();
        this.setupDropdown();
    }

    setupDropdown() {
        const trigger = document.getElementById('wishlist-trigger');
        const dropdown = document.getElementById('wishlist-dropdown');

        if (!trigger || !dropdown) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('opacity-0');
            dropdown.classList.toggle('invisible');
            dropdown.classList.toggle('opacity-100');
            dropdown.classList.toggle('visible');
        });

        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('opacity-0', 'invisible');
                dropdown.classList.remove('opacity-100', 'visible');
            }
        });
    }

    add(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.save();
            this.updateUI();
            return true;
        }
        return false;
    }

    remove(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.save();
            this.updateUI();
            return true;
        }
        return false;
    }

    toggle(productId) {
        if (this.has(productId)) {
            this.remove(productId);
            return false;
        } else {
            this.add(productId);
            return true;
        }
    }

    has(productId) {
        return this.wishlist.includes(productId);
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
    }

    updateUI() {
        const count = this.wishlist.length;
        const countEls = document.querySelectorAll('#wishlist-count');

        countEls.forEach(el => {
            if (count > 0) {
                el.textContent = count;
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });

        this.updateDropdown();
        window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count } }));
    }

    updateDropdown() {
        const dropdown = document.getElementById('wishlist-dropdown');
        if (!dropdown) return;

        const itemsContainer = dropdown.querySelector('.wishlist-items');
        if (!itemsContainer) return;

        if (this.wishlist.length === 0) {
            itemsContainer.innerHTML = '<p class="text-center text-gray-500 py-4 text-sm">Twoja lista życzeń jest pusta.</p>';
            return;
        }

        const products = window.productsData || [];
        const wishlistProducts = products.filter(p => this.wishlist.includes(p.id));

        itemsContainer.innerHTML = wishlistProducts.map(product => `
            <div class="flex items-center gap-3 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group/item">
                <a href="product.html?id=${product.id}" class="flex items-center gap-3 flex-1 min-w-0">
                    <img src="${product.images && product.images[0] ? product.images[0] : './assets/products/placeholder.jpg'}" 
                         alt="${product.name}" 
                         class="w-10 h-10 object-cover rounded-md">
                    <div class="min-w-0">
                        <h4 class="text-sm font-medium text-black dark:text-white truncate group-hover/item:text-biotune-red transition-colors">${product.name}</h4>
                        <p class="text-xs text-biotune-red font-bold">${product.price.toFixed(2)} zł</p>
                    </div>
                </a>
                <div class="flex items-center gap-1">
                    <button onclick="window.addToCart(window.productsData.find(p => p.id === '${product.id}'))" 
                            class="text-gray-400 hover:text-biotune-red transition-colors p-1"
                            title="Dodaj do koszyka">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a .375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </button>
                    <button onclick="window.wishlistManager.remove('${product.id}')" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Usuń z listy życzeń">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

window.wishlistManager = new WishlistManager();
