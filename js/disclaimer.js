// Disclaimer Modal Functionality - Always shows on every page load
(function () {
    // Always show disclaimer on every product page visit
    showDisclaimerModal();

    function showDisclaimerModal() {
        // Create modal HTML with proper Polish characters
        const modalHTML = `
            <div id="disclaimer-modal" class="disclaimer-modal active">
                <div class="disclaimer-content">
                    <h2 class="text-2xl font-bold mb-4 text-black dark:text-white">Oświadczenie</h2>
                    <div class="space-y-4 mb-6">
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Oświadczam, że kupowane produkty są odczynnikami chemicznymi przeznaczonymi wyłącznie do badań laboratoryjnych i nie zostaną użyte do spożycia ani stosowania u ludzi.
                        </p>
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Rozumiem, że produkty nie są lekami, żywnością ani kosmetykami w rozumieniu przepisów prawa.
                        </p>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="acceptDisclaimer()" class="flex-1 bg-biotune-red text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
                            Akceptuję
                        </button>
                        <button onclick="declineDisclaimer()" class="flex-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                            Odrzucam
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    window.acceptDisclaimer = function () {
        // Just close modal, no session storage
        const modal = document.getElementById('disclaimer-modal');
        if (modal) {
            modal.remove();
        }
    };

    window.declineDisclaimer = function () {
        // Redirect back to shop
        window.location.href = 'index.html#shop';
    };
})();
