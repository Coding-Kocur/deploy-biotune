const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexFile, 'utf8');
const hasBOM = content.charCodeAt(0) === 0xFEFF;
if (hasBOM) content = content.slice(1);

// Step 1: Add Dropdown to Navbar
const navLinkToReplace = /<a href="about\.html"[\s\S]*?O\s*Nas<\/a>/;
const dynamicNavBlock = `
                    <div class="dropdown-trigger">
                        <a href="#" class="hover:text-biotune-red transition-colors px-3 py-2 rounded-md text-sm font-medium inline-flex items-center text-biotune-red">
                            Wersje Hero
                            <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </a>
                        <div class="dropdown-menu">
                            <div class="py-1">
                                <a href="#" onclick="switchHero('hero-v1', event)" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V1: Oryginał</a>
                                <a href="#" onclick="switchHero('hero-v2', event)" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V2: Cząsteczki (Particles)</a>
                                <a href="#" onclick="switchHero('hero-v3', event)" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V3: Typografia (GSAP)</a>
                                <a href="#" onclick="switchHero('hero-v4', event)" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V4: Siatka 3D (WebGL)</a>
                                <a href="#" onclick="switchHero('hero-v5', event)" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V5: Kinematografia (Video)</a>
                                <a href="#" onclick="switchHero('hero-v6', event)" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V6: Split-Screen Hover</a>
                            </div>
                        </div>
                    </div>
                    <a href="about.html" class="hover:text-biotune-red transition-colors px-3 py-2 rounded-md text-sm font-medium">O Nas</a>
`;

// Only replace if 'Wersje Hero' is not already there
if (!content.includes('Wersje Hero')) {
    content = content.replace(navLinkToReplace, dynamicNavBlock);
}

// Rename original hero to hero-v1
content = content.replace('<section id="hero" class="pt-44', '<section id="hero-v1" class="hero-section pt-44');
// Handle if already renamed but doesn't have class
if (content.includes('id="hero-v1"') && !content.includes('hero-section pt-44')) {
    content = content.replace('<section id="hero-v1" class="pt-44', '<section id="hero-v1" class="hero-section pt-44');
}

// Ensure original hero is not hidden by default
content = content.replace('<section id="hero-v1" class="hero-section hidden pt-44', '<section id="hero-v1" class="hero-section pt-44');

// We need to inject the other heroes right after the closing tag of hero-v1.
const hero1EndRegex = /<\/section>\s*<!-- Products Section REMOVED/;

if (!content.includes('id="hero-v2"')) {
    const v2Html = fs.readFileSync(path.join(__dirname, 'index-v2.html'), 'utf8');
    const v3Html = fs.readFileSync(path.join(__dirname, 'index-v3.html'), 'utf8');
    const v4Html = fs.readFileSync(path.join(__dirname, 'index-v4.html'), 'utf8');
    const v5Html = fs.readFileSync(path.join(__dirname, 'index-v5.html'), 'utf8');
    const v6Html = fs.readFileSync(path.join(__dirname, 'index-v6.html'), 'utf8');

    const extractSection = (html, id) => {
        const regex = /<section id="hero"[\s\S]*?<\/section>/;
        const match = html.match(regex);
        let section = match ? match[0] : '';
        section = section.replace('id="hero"', `id="${id}" class="hero-section hidden"`);
        section = section.replace('class="pt-24', 'class="pt-24 hero-section hidden');
        section = section.replace('class="pt-32', 'class="pt-32 hero-section hidden');
        section = section.replace('class="pt-0', 'class="pt-0 hero-section hidden');
        section = section.replace('class="p-0', 'class="p-0 hero-section hidden');

        // Ensure that any inline styles needed for V3 and V6 are also extracted
        const styleRegex = /<style>[\s\S]*?<\/style>/g;
        let styles = '';
        let m;
        while ((m = styleRegex.exec(html)) !== null) {
            // Only grab specific styles for these variations, ignore global ones
            if (m[0].includes('gsap-reveal-text') || m[0].includes('split-container')) {
                styles += m[0] + '\n';
            }
        }

        return styles + section;
    };

    const v2 = extractSection(v2Html, 'hero-v2');
    const v3 = extractSection(v3Html, 'hero-v3');
    const v4 = extractSection(v4Html, 'hero-v4');
    const v5 = extractSection(v5Html, 'hero-v5');
    const v6 = extractSection(v6Html, 'hero-v6');

    // Also extract library scripts to put at the bottom
    const libScripts = `
    <!-- Hero Variations Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-engine@2.12.0/tsparticles.engine.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-basic@2.12.0/tsparticles.basic.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-interaction-particles-links@2.12.0/tsparticles.interaction.particles.links.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-move-base@2.12.0/tsparticles.move.base.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-shape-circle@2.12.0/tsparticles.shape.circle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-updater-color@2.12.0/tsparticles.updater.color.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-updater-opacity@2.12.0/tsparticles.updater.opacity.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-updater-out-modes@2.12.0/tsparticles.updater.out-modes.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-updater-size@2.12.0/tsparticles.updater.size.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles-plugin-emitters@2.12.0/tsparticles.plugin.emitters.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js"></script>
    <script>
        // Init tsParticles
        async function loadParticles() {
            if(!window.tsParticles) return;
            await loadColorUpdater(tsParticles);
            await loadCircleShape(tsParticles);
            await loadBaseMover(tsParticles);
            await loadSizeUpdater(tsParticles);
            await loadOpacityUpdater(tsParticles);
            await loadOutModesUpdater(tsParticles);
            await loadParticlesLinksInteraction(tsParticles);
            
            await tsParticles.load("tsparticles", {
                fpsLimit: 60,
                interactivity: {
                    events: { onHover: { enable: true, mode: "grab" }, resize: true },
                    modes: { grab: { distance: 200, links: { opacity: 0.5 } } }
                },
                particles: {
                    color: { value: "#ff0000" },
                    links: { color: "#ff0000", distance: 150, enable: true, opacity: 0.2, width: 1 },
                    move: { enable: true, outModes: { default: "bounce" }, speed: 1 },
                    number: { density: { enable: true, area: 800 }, value: 80 },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { random: true, value: 3 },
                }
            });
        }
        
        let vantaEffect = null;

        function initVanta() {
            if(window.VANTA && !vantaEffect) {
                vantaEffect = VANTA.TOPOLOGY({
                    el: "#vanta-bg",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0xff0000,
                    backgroundColor: 0x000000
                });
            }
        }

        // Switcher logic
        function switchHero(heroId, event) {
            if(event) event.preventDefault();
            
            // Hide all
            document.querySelectorAll('.hero-section').forEach(sec => {
                sec.classList.add('hidden');
            });
            
            // Show target
            const target = document.getElementById(heroId);
            if(target) {
                target.classList.remove('hidden');
                target.classList.add('flex');
            }

            // Init libraries if needed
            if(heroId === 'hero-v2') setTimeout(() => { loadParticles(); }, 100);
            if(heroId === 'hero-v4') setTimeout(() => { initVanta(); }, 100);
            
            // Re-trigger GSAP animations for V3 by re-inserting the elements to restart CSS animations
            if(heroId === 'hero-v3') {
                const animatedEls = target.querySelectorAll('.gsap-reveal-text, .gsap-fade-up');
                animatedEls.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; /* trigger reflow */
                    el.style.animation = null; 
                });
            }

            // Close dropdown manually for smooth UX
            const dropdown = event?.target?.closest('.dropdown-trigger');
            if(dropdown) {
                dropdown.classList.remove('active'); // assuming active class toggle
                // unfocus to close hover state
                document.activeElement.blur();
            }
        }
    </script>
    `;

    // Try to insert sections before "Products Section REMOVED"
    content = content.replace(hero1EndRegex, `</section>
    ${v2}
    ${v3}
    ${v4}
    ${v5}
    ${v6}
    <!-- Products Section REMOVED`);

    // Insert scripts before </body>
    content = content.replace('</body>', `${libScripts}\n</body>`);
}

// Add CSS to ensure hidden works well with flex
const cssFix = `
    <style>
        .hero-section.hidden {
            display: none !important;
        }
    </style>
`;
if (!content.includes('.hero-section.hidden')) {
    content = content.replace('</head>', `${cssFix}</head>`);
}


fs.writeFileSync(indexFile, (hasBOM ? '\uFEFF' : '') + content, 'utf8');
console.log('Merged V2-V6 into index.html successfully.');

// Delete the external files
const variations = [2, 3, 4, 5, 6];
variations.forEach(v => {
    const vPath = path.join(__dirname, `index-v${v}.html`);
    if (fs.existsSync(vPath)) {
        fs.unlinkSync(vPath);
        console.log(`Deleted ${vPath}`);
    }
});
