// Main Page Disclaimer - Shows on first visit to homepage
(function() {
    const HOMEPAGE_DISCLAIMER_KEY = 'biotune_homepage_disclaimer_seen';
    
    // Check if user has seen the disclaimer before
    const hasSeenDisclaimer = localStorage.getItem(HOMEPAGE_DISCLAIMER_KEY);
    
    if (!hasSeenDisclaimer) {
        showHomepageDisclaimer();
    }
    
    function showHomepageDisclaimer() {
        const modalHTML = `
            <div id="homepage-disclaimer-modal" class="disclaimer-modal active">
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
                        <button onclick="acceptHomepageDisclaimer()" class="flex-1 bg-biotune-red text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
                            Akceptuję
                        </button>
                        <button onclick="declineHomepageDisclaimer()" class="flex-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                            Odrzucam
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    window.acceptHomepageDisclaimer = function() {
        localStorage.setItem(HOMEPAGE_DISCLAIMER_KEY, 'true');
        const modal = document.getElementById('homepage-disclaimer-modal');
        if (modal) {
            modal.remove();
        }
    };
    
    window.declineHomepageDisclaimer = function() {
        // Close the page or redirect away
        window.close();
        // If window.close() doesn't work, redirect to a disclaimer page
        setTimeout(() => {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:2rem;"><div><h1 style="color:#ff0000;font-size:2rem;margin-bottom:1rem;">Dostęp odrzucony</h1><p>Musisz zaakceptować oświadczenie, aby korzystać z tej strony.</p></div></div>';
        }, 100);
    };
})();
