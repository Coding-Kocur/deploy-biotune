/**
 * BioTune Checkout Agreements
 * Redirects cart drawer checkout button to checkout.html
 * Agreements are now handled on the dedicated checkout page
 */

(function () {
    'use strict';

    /**
     * Initialize checkout button to redirect to checkout page
     */
    function initCheckoutRedirect() {
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!checkoutBtn) {
            return;
        }

        // Remove any existing onclick handler
        checkoutBtn.removeAttribute('onclick');

        // Add click handler to redirect to checkout page
        checkoutBtn.addEventListener('click', handleCheckoutClick);

        console.log('[BioTune Checkout] Checkout redirect initialized');
    }

    /**
     * Handle checkout button click - redirect to checkout.html
     */
    function handleCheckoutClick(e) {
        e.preventDefault();

        // Check if cart has items
        const cart = JSON.parse(localStorage.getItem('biotune_cart') || '[]');

        if (cart.length === 0) {
            alert('Twój koszyk jest pusty!');
            return;
        }

        // Check if user is logged in (optional - can be enforced on checkout page)
        if (window.authSystem && !window.authSystem.isLoggedIn()) {
            // Optionally require login first
            const shouldLogin = confirm('Zalecamy zalogowanie się przed dokonaniem zakupu.\n\nCzy chcesz przejść do logowania?');
            if (shouldLogin) {
                window.location.href = 'login.html?redirect=checkout';
                return;
            }
        }

        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for cart drawer to be ready
        setTimeout(initCheckoutRedirect, 100);
    });

    // Re-initialize when cart is opened (in case of dynamic content)
    const cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => {
            setTimeout(initCheckoutRedirect, 100);
        });
    }

    // Export for external use
    window.initCheckoutRedirect = initCheckoutRedirect;

})();
