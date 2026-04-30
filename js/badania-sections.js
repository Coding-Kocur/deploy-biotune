// js/badania-sections.js - Variant 3
(function() {
    const PEPTIDES = (window.productsData || []).filter(p => p.id !== 'bac-water');
    const container = document.getElementById('sections-container');
    const sidebar = document.getElementById('sidebar-nav');

    if (!container || !PEPTIDES.length) return;

    // Generate HTML for each product section
    PEPTIDES.forEach((p, i) => {
        const isReverse = i % 2 !== 0;
        const sectionId = `product-${p.id}`;
        
        // Add dot to sidebar
        if (sidebar) {
            const dot = document.createElement('a');
            dot.href = `#${sectionId}`;
            dot.className = 'nav-dot w-3 h-3 rounded-full bg-white/20 hover:bg-white/60 transition-all duration-300 relative group block';
            dot.setAttribute('data-target', sectionId);
            dot.innerHTML = `
                <span class="absolute right-6 top-1/2 -translate-y-1/2 bg-black/80 px-3 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 backdrop-blur-sm">
                    ${p.name}
                </span>
            `;
            sidebar.appendChild(dot);
        }

        // Add section
        const section = document.createElement('section');
        section.id = sectionId;
        section.className = `product-section min-h-[80vh] flex flex-col ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center w-full border-b border-red-900/20`;
        
        const shortDesc = p.description.length > 100 ? p.description.substring(0, 100) + '...' : p.description;

        section.innerHTML = `
            <!-- Image Half -->
            <div class="w-full lg:w-1/2 h-[50vh] lg:h-[80vh] relative p-4 lg:p-12 flex items-center justify-center">
                <div class="img-wrapper relative w-full h-full max-w-2xl max-h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
                    <img src="./assets/test-report.png" alt="Raport testowy ${p.name}" class="img-main w-full h-full object-contain object-top" loading="lazy">
                    <div class="img-darken absolute inset-0 bg-transparent pointer-events-none"></div>
                    <div class="desc-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] text-center opacity-0 pointer-events-none">
                        <div class="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl">
                            <h3 class="text-xl font-bold text-white mb-2">${p.name}</h3>
                            <p class="text-3xl font-black text-biotune-red mb-1">&gt;99.1%</p>
                            <p class="text-xs text-gray-400 font-mono tracking-widest uppercase">HPLC Verified Purity</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Info Half -->
            <div class="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center section-info">
                <div class="mb-4">
                    <span class="inline-block text-xs font-mono text-biotune-red tracking-[0.2em] uppercase border border-biotune-red/30 px-3 py-1 rounded-full bg-biotune-red/5">Raport Badawczy</span>
                </div>
                <h2 class="text-4xl lg:text-5xl font-bold text-white mb-2">${p.name}</h2>
                <p class="text-gray-500 font-mono text-sm tracking-widest uppercase mb-8">Data badania: 2026-03-15</p>
                
                <div class="grid grid-cols-2 gap-6 mb-8 max-w-md">
                    <div class="bg-white/5 p-4 rounded-lg border border-white/5">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Stężenie</p>
                        <p class="text-biotune-red text-xl font-bold">&gt;99.1%</p>
                    </div>
                    <div class="bg-white/5 p-4 rounded-lg border border-white/5">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Czystość</p>
                        <p class="text-white font-semibold">HPLC</p>
                    </div>
                    <div class="bg-white/5 p-4 rounded-lg border border-white/5">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">CAS</p>
                        <p class="text-gray-300 text-sm font-mono">${p.cas || '—'}</p>
                    </div>
                    <div class="bg-white/5 p-4 rounded-lg border border-white/5">
                        <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Dawka</p>
                        <p class="text-gray-300 text-sm">${p.dosage}</p>
                    </div>
                </div>
                
                <p class="text-gray-400 leading-relaxed mb-8 max-w-lg text-lg">${shortDesc}</p>
                
                <div>
                    <a href="product.html?id=${p.id}" class="sweep-hover-btn inline-flex px-8 py-4 rounded text-sm font-bold uppercase tracking-wider text-center border-white/20 hover:border-biotune-red">
                        Zobacz w katalogu →
                    </a>
                </div>
            </div>
        `;
        container.appendChild(section);
    });

    // Search functionality (Hide sections not matching)
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', e => {
            const q = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.product-section').forEach(sec => {
                const id = sec.id.replace('product-', '');
                const prod = PEPTIDES.find(p => p.id === id);
                const match = !q || (prod && (prod.name.toLowerCase().includes(q) || (prod.cas||'').toLowerCase().includes(q)));
                sec.style.display = match ? '' : 'none';
            });
            // Update dots
            document.querySelectorAll('.nav-dot').forEach(dot => {
                const targetId = dot.getAttribute('data-target').replace('product-', '');
                const prod = PEPTIDES.find(p => p.id === targetId);
                const match = !q || (prod && (prod.name.toLowerCase().includes(q) || (prod.cas||'').toLowerCase().includes(q)));
                dot.style.display = match ? 'block' : 'none';
            });
            ScrollTrigger.refresh();
        });
    }

    // GSAP Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Active Dot Tracker
        const sections = document.querySelectorAll('.product-section');
        const dots = document.querySelectorAll('.nav-dot');
        
        // Setup intersection observer for the dots
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dots.forEach(d => {
                        if(d.getAttribute('data-target') === entry.target.id) {
                            d.classList.add('bg-biotune-red', 'scale-150');
                            d.classList.remove('bg-white/20');
                        } else {
                            d.classList.remove('bg-biotune-red', 'scale-150');
                            d.classList.add('bg-white/20');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));

        // Smooth scroll for dots
        dots.forEach(dot => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const target = document.getElementById(targetId);
                if (target) {
                    const offset = window.innerWidth > 1024 ? 96 : 64; // nav height
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Image animations + Info fade up
        sections.forEach((sec, i) => {
            const imgWrap = sec.querySelector('.img-wrapper');
            const imgMain = sec.querySelector('.img-main');
            const imgDarken = sec.querySelector('.img-darken');
            const descOverlay = sec.querySelector('.desc-overlay');
            const infoBox = sec.querySelector('.section-info');
            
            // Image scroll effect (scrub)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sec,
                    start: "top 60%",
                    end: "bottom 40%",
                    scrub: 1
                }
            });
            
            tl.to(imgMain, { scale: 1.15, duration: 1, ease: "none" }, 0)
              .to(imgDarken, { backgroundColor: "rgba(0,0,0,0.6)", duration: 1, ease: "none" }, 0)
              .to(descOverlay, { opacity: 1, duration: 0.5, ease: "none" }, 0.5);
              
            // Info text fade up
            gsap.from(infoBox.children, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sec,
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            });
        });
        
        // Hero animation
        const titleWords = document.querySelectorAll('.hero-title span');
        if(titleWords.length) {
            gsap.fromTo(titleWords, 
                { y: 100 }, 
                { y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
            );
        }
    }
})();
