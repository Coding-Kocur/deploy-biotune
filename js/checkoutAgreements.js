/**
 * BioTune Checkout Agreements
 * Handles consent checkboxes in cart drawer before checkout
 */

(function () {
    'use strict';

    // Agreement texts - EXACT text as specified, do not modify
    const CHECKOUT_AGREEMENTS = {
        terms: {
            id: 'agreement-terms',
            required: true,
            text: 'Akceptuję <a href="regulamin.html" target="_blank" class="text-biotune-red hover:underline">Regulamin sklepu BioTune</a> oraz <a href="privacy.html" target="_blank" class="text-biotune-red hover:underline">Politykę Prywatności</a>.'
        },
        ruo: {
            id: 'agreement-ruo',
            required: true,
            text: 'Oświadczam, że zakupione produkty są odczynnikami chemicznymi przeznaczonymi wyłącznie do celów badawczych (Research Use Only). Produkt nie jest lekiem, suplementem ani kosmetykiem i nie jest przeznaczony do spożycia ani iniekcji u ludzi.'
        },
        responsibility: {
            id: 'agreement-responsibility',
            required: true,
            text: 'Przyjmuję do wiadomości, że ponoszę pełną odpowiedzialność za sposób użycia zakupionych odczynników chemicznych i że Sprzedawca nie sprawuje nadzoru nad ich wykorzystaniem.'
        }
    };

    const REGULAMIN_VERSION = 'regulamin_2025-01-03';
    const STORAGE_KEY = 'biotune_agreements';

    /**
     * Initialize checkout agreements in cart drawer
     */
    function initCheckoutAgreements() {
        const checkoutBtn = document.getElementById('checkout-btn');
        const cartFooter = checkoutBtn?.parentElement;

        if (!cartFooter) {
            console.warn('[BioTune Agreements] Cart footer not found');
            return;
        }

        // Check if agreements already exist
        if (document.getElementById('checkout-agreements-container')) {
            return;
        }

        // Create agreements container
        const agreementsContainer = document.createElement('div');
        agreementsContainer.id = 'checkout-agreements-container';
        agreementsContainer.className = 'mb-4 space-y-3 text-sm';

        // Add title
        const title = document.createElement('p');
        title.className = 'font-semibold text-gray-700 dark:text-gray-300 mb-2';
        title.textContent = 'Wymagane zgody:';
        agreementsContainer.appendChild(title);

        // Create checkboxes
        Object.entries(CHECKOUT_AGREEMENTS).forEach(([key, agreement]) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-start gap-2';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = agreement.id;
            checkbox.className = 'mt-1 rounded border-gray-300 dark:border-gray-600 text-biotune-red focus:ring-biotune-red';
            checkbox.required = agreement.required;
            checkbox.addEventListener('change', updateCheckoutButton);

            const label = document.createElement('label');
            label.htmlFor = agreement.id;
            label.className = 'text-gray-600 dark:text-gray-400 text-xs leading-relaxed';
            label.innerHTML = agreement.text;

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            agreementsContainer.appendChild(wrapper);
        });

        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.type = 'button';
        downloadBtn.id = 'download-agreement-btn';
        downloadBtn.className = 'text-xs text-gray-500 dark:text-gray-500 hover:text-biotune-red transition-colors mt-2 hidden';
        downloadBtn.textContent = '📥 Pobierz kopię zgody (JSON)';
        downloadBtn.addEventListener('click', downloadAgreement);
        agreementsContainer.appendChild(downloadBtn);

        // Insert before the sum
        const sumDiv = cartFooter.querySelector('.flex.justify-between');
        if (sumDiv) {
            cartFooter.insertBefore(agreementsContainer, sumDiv);
        } else {
            cartFooter.insertBefore(agreementsContainer, checkoutBtn);
        }

        // Initially disable checkout button
        updateCheckoutButton();

        // Override checkout button click
        checkoutBtn.removeAttribute('onclick');
        checkoutBtn.addEventListener('click', handleCheckout);

        console.log('[BioTune Agreements] Checkout agreements initialized');
    }

    /**
     * Update checkout button state based on checkbox status
     */
    function updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkout-btn');
        const downloadBtn = document.getElementById('download-agreement-btn');
        if (!checkoutBtn) return;

        const allChecked = Object.values(CHECKOUT_AGREEMENTS).every(agreement => {
            const checkbox = document.getElementById(agreement.id);
            return checkbox && checkbox.checked;
        });

        if (allChecked) {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            checkoutBtn.classList.add('hover:bg-red-600');
            if (downloadBtn) downloadBtn.classList.remove('hidden');
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            checkoutBtn.classList.remove('hover:bg-red-600');
            if (downloadBtn) downloadBtn.classList.add('hidden');
        }
    }

    /**
     * Handle checkout button click
     */
    function handleCheckout(e) {
        e.preventDefault();

        // Verify all checkboxes are checked
        const allChecked = Object.values(CHECKOUT_AGREEMENTS).every(agreement => {
            const checkbox = document.getElementById(agreement.id);
            return checkbox && checkbox.checked;
        });

        if (!allChecked) {
            alert('Proszę zaakceptować wszystkie wymagane zgody przed kontynuowaniem.');
            return;
        }

        // Gather agreement data
        const agreementData = {
            terms: document.getElementById('agreement-terms')?.checked || false,
            ruo: document.getElementById('agreement-ruo')?.checked || false,
            responsibility: document.getElementById('agreement-responsibility')?.checked || false,
            timestamp: Date.now(),
            version: REGULAMIN_VERSION,
            clientEmail: window.authSystem?.getCurrentUser()?.email || null,
            checkoutCartHash: calculateCartHash(window.cart || [])
        };

        // Log to console for audit
        console.log('[BioTune Agreements] Checkout agreement accepted:', agreementData);

        // Save to localStorage
        saveAgreementLocal(agreementData);

        // Attempt to POST to server (placeholder)
        postAgreementServer(agreementData);

        // Show confirmation modal
        showConfirmationModal(agreementData);
    }

    /**
     * Show confirmation modal before final checkout
     */
    function showConfirmationModal(agreementData) {
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'agreement-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-biotune-dark rounded-lg max-w-md w-full p-6 shadow-2xl">
                <h3 class="text-xl font-bold mb-4 text-black dark:text-white">Potwierdzenie zgód</h3>
                <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <p>✅ Regulamin i Polityka Prywatności zaakceptowane</p>
                    <p>✅ Oświadczenie RUO (Research Use Only) złożone</p>
                    <p>✅ Przyjęcie odpowiedzialności potwierdzone</p>
                    <p class="text-xs text-gray-500 mt-4">
                        Wersja regulaminu: ${agreementData.version}<br>
                        Data: ${new Date(agreementData.timestamp).toLocaleString('pl-PL')}
                    </p>
                </div>
                <div class="flex gap-3">
                    <button id="modal-download" class="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                        📥 Pobierz kopię
                    </button>
                    <button id="modal-proceed" class="flex-1 bg-biotune-red text-white py-2 px-4 rounded hover:bg-red-600 transition-colors font-semibold">
                        Kontynuuj
                    </button>
                </div>
                <button id="modal-cancel" class="w-full mt-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                    Anuluj
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('modal-download').addEventListener('click', () => {
            downloadAgreementJSON(agreementData);
        });

        document.getElementById('modal-proceed').addEventListener('click', () => {
            modal.remove();
            proceedToCheckout();
        });

        document.getElementById('modal-cancel').addEventListener('click', () => {
            modal.remove();
        });
    }

    /**
     * Proceed to actual checkout
     */
    function proceedToCheckout() {
        // Check if user is logged in
        if (window.authSystem && window.authSystem.isLoggedIn()) {
            if (window.cart && window.cart.length > 0) {
                // Redirect to checkout or payment page
                alert('Przekierowywanie do płatności...\n(Integracja z bramką płatniczą w przygotowaniu)');
                // TODO: Implement actual checkout redirect
                // window.location.href = 'checkout.html';
            } else {
                alert('Twój koszyk jest pusty!');
            }
        } else {
            window.location.href = 'login.html';
        }
    }

    /**
     * Save agreement to localStorage
     */
    function saveAgreementLocal(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('[BioTune Agreements] Saved to localStorage');
        } catch (error) {
            console.error('[BioTune Agreements] Failed to save to localStorage:', error);
        }
    }

    /**
     * POST agreement to server (placeholder)
     */
    async function postAgreementServer(data) {
        console.log('[BioTune Agreements] POST to /api/agreements (placeholder):', data);

        try {
            // TODO: implement backend endpoint
            const response = await fetch('/api/agreements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('[BioTune Agreements] Server accepted agreement');
            }
        } catch (error) {
            console.warn('[BioTune Agreements] Server unavailable, using localStorage fallback');
        }
    }

    /**
     * Download agreement as JSON
     */
    function downloadAgreement() {
        const agreementData = {
            terms: document.getElementById('agreement-terms')?.checked || false,
            ruo: document.getElementById('agreement-ruo')?.checked || false,
            responsibility: document.getElementById('agreement-responsibility')?.checked || false,
            timestamp: Date.now(),
            version: REGULAMIN_VERSION,
            downloadedAt: new Date().toISOString()
        };
        downloadAgreementJSON(agreementData);
    }

    /**
     * Download JSON file
     */
    function downloadAgreementJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `biotune-zgoda-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('[BioTune Agreements] Agreement JSON downloaded');
    }

    /**
     * Calculate cart hash for audit trail
     */
    function calculateCartHash(cartItems) {
        const str = JSON.stringify(cartItems);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return 'cart_' + Math.abs(hash).toString(16);
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for cart drawer to be ready
        setTimeout(initCheckoutAgreements, 100);
    });

    // Re-initialize when cart is opened
    const cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => {
            setTimeout(initCheckoutAgreements, 100);
        });
    }

    // Export for external use
    window.initCheckoutAgreements = initCheckoutAgreements;

})();
