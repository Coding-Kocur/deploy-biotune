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
    // Check if product is in stock
    if (!product || product.stock === 0) {
        console.log('Cannot add product to cart: out of stock');
        return false;
    }

    window.cart.push(product);
    localStorage.setItem('biotune_cart', JSON.stringify(window.cart));
    updateCart();
    window.openCart();
    return true;
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
                        <p class="text-xs ${product.stock > 0 ? 'text-biotune-red' : 'text-gray-400'} font-bold">${product.stock > 0 ? product.price.toFixed(2) + ' zł' : 'Brak w magazynie'}</p>
                    </div>
                </a>
                <div class="flex items-center gap-1">
                    ${product.stock > 0 ? `
                    <button onclick="window.addToCart(window.productsData.find(p => p.id === '${product.id}'))" 
                            class="text-gray-400 hover:text-biotune-red transition-colors p-1"
                            title="Dodaj do koszyka">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </button>
                    ` : ''}
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

// Global Generic Reveal Animation for Newsletter and Contact forms
document.addEventListener('DOMContentLoaded', () => {
    const animObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('global-anim-reveal');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const targets = document.querySelectorAll('.newsletter-section > *, #contact .max-w-3xl > *');
    targets.forEach(el => {
        el.classList.add('global-anim-hidden');
        
        // Calculate delay based on index relative to parent
        const children = Array.from(el.parentElement.children);
        const idx = children.indexOf(el);
        el.style.transitionDelay = `${idx * 0.15}s`;
        
        animObserver.observe(el);
    });
});

    // ============================================
    // HAMBURGER MENU — slide-in panel + overlay
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');

    function openMobileMenu() {
        if (!mobileMenuPanel) return;
        mobileMenuPanel.classList.add('open');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
        // Switch hamburger → X
        const svg = mobileMenuBtn && mobileMenuBtn.querySelector('svg');
        if (svg) svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
    }

    window.closeMobileMenu = function() {
        if (!mobileMenuPanel) return;
        mobileMenuPanel.classList.remove('open');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        // Switch X → hamburger
        const svg = mobileMenuBtn && mobileMenuBtn.querySelector('svg');
        if (svg) svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenuPanel && mobileMenuPanel.classList.contains('open');
            if (isOpen) window.closeMobileMenu();
            else openMobileMenu();
        });
    }

    // Close on overlay click
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', window.closeMobileMenu);
    }

    // Close button inside panel
    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', window.closeMobileMenu);
    }

    // Close menu on any primary link click (not sublinks or buttons)
    if (mobileMenuPanel) {
        mobileMenuPanel.querySelectorAll('.mobile-menu-link, .mobile-menu-sublink').forEach(link => {
            if (link.tagName === 'A') {
                link.addEventListener('click', () => {
                    // Small delay so the navigation registers
                    setTimeout(window.closeMobileMenu, 150);
                });
            }
        });
    }


// ============================================
// MOBILE HERO SCROLL-ACCORDION (≤1024px)
// Uses GSAP ScrollTrigger to pin the hero and
// expand one panel at a time as the user scrolls.
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const isMobileOrTablet = () => window.innerWidth <= 1024;

    // Store references for cleanup
    let heroAccordionST = null;
    let heroAccordionTL = null;
    let heroSpacer = null;

    function cleanupHeroAccordion() {
        if (heroAccordionTL) {
            heroAccordionTL.kill();
            heroAccordionTL = null;
        }
        if (heroAccordionST) {
            heroAccordionST.kill();
            heroAccordionST = null;
        }
        // Remove spacer wrapper if it exists
        if (heroSpacer) {
            const container = heroSpacer.querySelector('.split-container');
            if (container && heroSpacer.parentNode) {
                heroSpacer.parentNode.insertBefore(container, heroSpacer);
                heroSpacer.remove();
            }
            heroSpacer = null;
        }
        // Clean up classes and inline styles from panels
        const panels = document.querySelectorAll('.split-panel');
        panels.forEach(p => {
            p.classList.remove('active-panel', 'mobile-revealed');
            p.style.flex = '';
        });
    }

    function setupHeroAccordion() {
        if (!isMobileOrTablet()) return;
        if (!window.gsap || !window.ScrollTrigger) return;

        const container = document.querySelector('.split-container');
        if (!container) return;

        // Get panels sorted by their CSS order (visual order)
        const panelsRaw = Array.from(container.querySelectorAll('.split-panel'));
        if (!panelsRaw.length) return;

        const panels = panelsRaw.slice().sort((a, b) => {
            return (parseInt(getComputedStyle(a).order) || 0) - (parseInt(getComputedStyle(b).order) || 0);
        });

        const numPanels = panels.length; // 3

        // Wrap container in a spacer div for scroll length
        if (!heroSpacer) {
            heroSpacer = document.createElement('div');
            heroSpacer.className = 'hero-accordion-spacer';
            heroSpacer.style.position = 'relative';
            heroSpacer.style.width = '100%';
            container.parentNode.insertBefore(heroSpacer, container);
            heroSpacer.appendChild(container);
        }
        // Spacer height = numPanels screens of scroll
        heroSpacer.style.height = (numPanels * 100) + 'vh';

        // Ensure container has full width (critical for GSAP pin)
        container.style.width = '100%';

        // Set initial flex values: first panel expanded, rest collapsed
        const EXPANDED = 5;
        const COLLAPSED = 0.8;

        panels.forEach((panel, i) => {
            panel.style.flex = (i === 0) ? EXPANDED : COLLAPSED;
            if (i === 0) {
                panel.classList.add('active-panel');
            } else {
                panel.classList.remove('active-panel');
            }
        });

        // Build GSAP timeline
        heroAccordionTL = gsap.timeline({
            scrollTrigger: {
                trigger: heroSpacer,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                pin: container,
                pinSpacing: false,
                invalidateOnRefresh: true,
                snap: {
                    snapTo: 1 / (numPanels - 1),
                    duration: { min: 0.2, max: 0.5 },
                    ease: 'power2.inOut'
                },
                onUpdate: function(self) {
                    // Determine which panel should be active based on progress
                    const progress = self.progress;
                    let activeIdx = Math.round(progress * (numPanels - 1));
                    activeIdx = Math.max(0, Math.min(numPanels - 1, activeIdx));
                    panels.forEach((panel, i) => {
                        if (i === activeIdx) {
                            panel.classList.add('active-panel');
                        } else {
                            panel.classList.remove('active-panel');
                        }
                    });
                }
            }
        });

        // Animate flex transitions between panels
        for (let i = 0; i < numPanels - 1; i++) {
            const step = i; // timeline position
            // Collapse current panel
            heroAccordionTL.to(panels[i], {
                flex: COLLAPSED,
                duration: 1,
                ease: 'power2.inOut'
            }, step);
            // Expand next panel
            heroAccordionTL.to(panels[i + 1], {
                flex: EXPANDED,
                duration: 1,
                ease: 'power2.inOut'
            }, step);
            // Also collapse any other panels that might be expanded
            panels.forEach((p, j) => {
                if (j !== i && j !== i + 1) {
                    heroAccordionTL.to(p, {
                        flex: COLLAPSED,
                        duration: 1,
                        ease: 'power2.inOut'
                    }, step);
                }
            });
        }

        // Store the ScrollTrigger reference
        heroAccordionST = heroAccordionTL.scrollTrigger;
    }

    // Initialize
    if (isMobileOrTablet()) {
        setupHeroAccordion();
    }

    // Handle resize / orientation change
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cleanupHeroAccordion();
            if (isMobileOrTablet()) {
                setupHeroAccordion();
            }
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        }, 300);
    });
});

