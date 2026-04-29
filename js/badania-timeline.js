// Badania Timeline — dynamic renderer (Variant 1: Vertical Timeline Feed)
(function() {
    const PEPTIDES = (window.productsData || []).filter(p => p.id !== 'bac-water');
    const container = document.getElementById('timeline-container');
    if (!container || !PEPTIDES.length) return;

    PEPTIDES.forEach((p, i) => {
        const isEven = i % 2 === 0;
        const card = document.createElement('div');
        card.className = 'tl-node' + (isEven ? ' tl-left' : ' tl-right');
        card.setAttribute('data-product-id', p.id);
        card.innerHTML = `
            <div class="tl-dot"></div>
            <div class="tl-card">
                <h3 class="text-2xl font-bold text-white mb-1">${p.name}</h3>
                <p class="text-sm text-gray-500 font-mono mb-4">Data badania: 2026-03-15</p>
                <div class="tl-card-body">
                    <div class="tl-info">
                        <p class="text-biotune-red font-semibold mb-2">Stężenie i czystość: &gt;99.1%</p>
                        <p class="text-gray-400 text-sm mb-1">CAS: ${p.cas || '—'}</p>
                        <p class="text-gray-400 text-sm mb-4">Dawka: ${p.dosage}</p>
                        <a href="product.html?id=${p.id}" class="sweep-hover-btn inline-block px-6 py-2 rounded text-sm font-bold uppercase tracking-wider">
                            Zobacz w katalogu →
                        </a>
                    </div>
                    <div class="tl-report-wrap">
                        <img src="./assets/test-report.png" alt="Raport testowy ${p.name}" class="tl-report-img" loading="lazy">
                        <div class="tl-report-darken"></div>
                    </div>
                </div>
            </div>`;
        container.appendChild(card);
    });

    // Search
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', e => {
            const q = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.tl-node').forEach(n => {
                const id = n.getAttribute('data-product-id');
                const prod = PEPTIDES.find(p => p.id === id);
                const match = !q || (prod && (prod.name.toLowerCase().includes(q) || (prod.cas||'').toLowerCase().includes(q)));
                n.style.display = match ? '' : 'none';
            });
        });
    }

    // GSAP ScrollTrigger animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.tl-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0, y: 60, duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });
        gsap.utils.toArray('.tl-dot').forEach(dot => {
            gsap.from(dot, {
                scale: 0, duration: 0.5, ease: 'back.out(1.7)',
                scrollTrigger: { trigger: dot, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });
    }
})();
