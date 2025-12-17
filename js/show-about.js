// Initialize section visibility on page load
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const shopSection = document.getElementById('shop');

    // Initially hide About section (but after animations load)
    setTimeout(() => {
        if (aboutSection) {
            aboutSection.style.display = 'none';
        }
    }, 1000); // Give animations time to initialize

    // Update O Nas link to use the function
    const oNasLinks = document.querySelectorAll('a[href="#about"], a[href="index.html#about"]');
    oNasLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showAboutSection();
        });
    });

    // Add "Back to Shop" functionality in About section
    if (aboutSection && !document.getElementById('back-to-shop-btn')) {
        const backButton = document.createElement('button');
        backButton.id = 'back-to-shop-btn';
        backButton.innerHTML = '← Powrót do sklepu';
        backButton.className = 'fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-biotune-red text-white px-8 py-4 rounded-full font-bold hover:bg-red-600 transition-all z-50 shadow-lg';
        backButton.style.display = 'none'; // Hidden by default
        backButton.onclick = showShopSection;
        aboutSection.appendChild(backButton);
    }
});

// Show About section when O Nas is clicked
window.showAboutSection = function () {
    const aboutSection = document.getElementById('about');
    const shopSection = document.getElementById('shop');
    const backButton = document.getElementById('back-to-shop-btn');

    if (aboutSection && shopSection) {
        // Hide shop section completely
        shopSection.style.display = 'none';

        // Show about section
        aboutSection.style.display = 'block';

        // Show back button
        if (backButton) {
            backButton.style.display = 'block';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Refresh ScrollTrigger after showing section
        setTimeout(() => {
            if (window.ScrollTrigger) {
                window.ScrollTrigger.refresh();
            }
        }, 100);
    }
};

// Show Shop section (for back navigation)
window.showShopSection = function () {
    const aboutSection = document.getElementById('about');
    const shopSection = document.getElementById('shop');
    const backButton = document.getElementById('back-to-shop-btn');

    if (aboutSection && shopSection) {
        // Hide about section
        aboutSection.style.display = 'none';

        // Hide back button
        if (backButton) {
            backButton.style.display = 'none';
        }

        // Show shop section
        shopSection.style.display = 'flex';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
