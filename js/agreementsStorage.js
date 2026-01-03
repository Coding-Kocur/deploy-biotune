/**
 * BioTune Agreements Storage Utility
 * Handles localStorage audit trail and placeholder API calls
 */

const STORAGE_KEY = 'biotune_agreements';

/**
 * Save agreement data to localStorage
 * @param {Object} agreementData - Agreement information to store
 */
function saveAgreementLocal(agreementData) {
    const data = {
        ...agreementData,
        timestamp: Date.now(),
        version: window.REGULAMIN_VERSION || 'regulamin_2025-01-03'
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('[BioTune Agreements] Saved to localStorage:', data);
        return true;
    } catch (error) {
        console.error('[BioTune Agreements] Failed to save to localStorage:', error);
        return false;
    }
}

/**
 * Retrieve agreement data from localStorage
 * @returns {Object|null} Stored agreement data or null
 */
function getAgreementLocal() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('[BioTune Agreements] Failed to read from localStorage:', error);
        return null;
    }
}

/**
 * Clear agreement data from localStorage
 */
function clearAgreementLocal() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[BioTune Agreements] Cleared localStorage');
        return true;
    } catch (error) {
        console.error('[BioTune Agreements] Failed to clear localStorage:', error);
        return false;
    }
}

/**
 * POST agreement data to server
 * TODO: Implement backend endpoint at /api/agreements
 * @param {Object} agreementData - Agreement information to send
 * @returns {Promise<boolean>} Success status
 */
async function postAgreementServer(agreementData) {
    const payload = {
        ...agreementData,
        timestamp: Date.now(),
        version: window.REGULAMIN_VERSION || 'regulamin_2025-01-03'
    };

    console.log('[BioTune Agreements] Attempting to POST to /api/agreements:', payload);

    try {
        // TODO: implement backend endpoint
        const response = await fetch('/api/agreements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('[BioTune Agreements] Successfully posted to server');
            return true;
        } else {
            console.warn('[BioTune Agreements] Server returned error:', response.status);
            // Fallback to localStorage
            saveAgreementLocal(payload);
            return false;
        }
    } catch (error) {
        console.warn('[BioTune Agreements] Network error, falling back to localStorage:', error.message);
        // Fallback to localStorage when server is unavailable
        saveAgreementLocal(payload);
        return false;
    }
}

/**
 * Generate and download agreement as JSON file
 * @param {Object} agreementData - Agreement data to download
 */
function downloadAgreementJSON(agreementData) {
    const data = {
        ...agreementData,
        timestamp: Date.now(),
        version: window.REGULAMIN_VERSION || 'regulamin_2025-01-03',
        downloadedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `biotune-zgoda-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('[BioTune Agreements] Downloaded agreement JSON');
}

/**
 * Calculate simple hash of cart for audit trail
 * @param {Array} cartItems - Cart items array
 * @returns {string} Simple hash string
 */
function calculateCartHash(cartItems) {
    const cartString = JSON.stringify(cartItems);
    let hash = 0;
    for (let i = 0; i < cartString.length; i++) {
        const char = cartString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return 'cart_' + Math.abs(hash).toString(16);
}

// Export to window for use in other scripts
window.agreementsStorage = {
    save: saveAgreementLocal,
    get: getAgreementLocal,
    clear: clearAgreementLocal,
    postToServer: postAgreementServer,
    downloadJSON: downloadAgreementJSON,
    calculateCartHash: calculateCartHash
};
