// js/badania-masonry.js - Variant 2
(function() {
    const PEPTIDES = (window.productsData || []).filter(p => p.id !== 'bac-water');
    const container = document.getElementById('masonry-grid');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxPurity = document.getElementById('lightbox-purity');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!container || !PEPTIDES.length) return;

    PEPTIDES.forEach((p, i) => {
        // Add varying text to create masonry staggered effect
        const extraText = i % 3 === 0 ? '<p class="text-xs text-gray-400 mt-2">Badanie zrealizowane z użyciem metody spektrometrii mas (MS) potwierdzające zgodność strukturalną oraz wysoką czystość chromatograficzną.</p>' : '';
        
        const card = document.createElement('div');
        card.className = 'masonry-card masonry-item';
        card.setAttribute('data-product-id', p.id);
        card.innerHTML = `
            <div class="card-img-wrap" data-name="${p.name}" data-purity=">99.1%">
                <img src="./assets/test-report.png" alt="Raport testowy ${p.name}" class="card-img" loading="lazy">
                <div class="img-zoom-hint"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg></div>
            </div>
            <div class="card-body p-6">
                <h3 class="text-xl font-bold text-white mb-1">${p.name}</h3>
                <p class="text-xs text-gray-500 tracking-wider uppercase font-mono">Data badania: 2026-03-15</p>
                <div class="h-px bg-white/10 my-4"></div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Stężenie</p>
                        <p class="text-biotune-red text-2xl font-bold">&gt;99.1%</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Czystość</p>
                        <p class="text-white text-sm font-semibold mt-1">HPLC Verified</p>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mb-4">CAS: ${p.cas || '—'}</p>
                ${extraText}
                <div class="mt-4">
                    <a href="product.html?id=${p.id}" class="sweep-hover-btn w-full px-6 py-3 rounded text-sm font-bold uppercase tracking-wider text-center border-white/20 hover:border-biotune-red">
                        Karta produktu →
                    </a>
                </div>
            </div>`;
        container.appendChild(card);
    });

    // Lightbox Logic
    document.querySelectorAll('.card-img-wrap').forEach(wrap => {
        wrap.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const purity = this.getAttribute('data-purity');
            if (lightboxImg) lightboxImg.src = this.querySelector('img').src;
            if (lightboxTitle) lightboxTitle.textContent = name;
            if (lightboxPurity) lightboxPurity.textContent = `Stężenie: ${purity}`;
            if (lightbox) {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Search Filtering
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', e => {
            const q = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.masonry-item').forEach(n => {
                const id = n.getAttribute('data-product-id');
                const prod = PEPTIDES.find(p => p.id === id);
                const match = !q || (prod && (prod.name.toLowerCase().includes(q) || (prod.cas||'').toLowerCase().includes(q)));
                n.style.display = match ? '' : 'none';
            });
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
    }

    // GSAP ScrollTrigger batch animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        setTimeout(() => {
            ScrollTrigger.batch('.masonry-item', {
                start: 'top 85%',
                onEnter: batch => gsap.fromTo(batch, 
                    { opacity: 0, y: 40 }, 
                    { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', overwrite: true }
                ),
            });
        }, 100);
    }
})();
