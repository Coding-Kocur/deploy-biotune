const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index-v2.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hasBOM = content.charCodeAt(0) === 0xFEFF;
if (hasBOM) content = content.slice(1);

const heroRegex = /<section id="hero"[\s\S]*?<\/section>/;

const newHero = `
    <section id="hero" class="pt-24 pb-0 min-h-screen relative flex flex-col justify-center overflow-hidden bg-black">
        
        <!-- Particles container -->
        <div id="tsparticles" class="absolute inset-0 z-0"></div>
        
        <!-- Soft gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none z-10"></div>
        
        <div class="w-full relative z-20 text-center px-4">
            
            <div class="max-w-4xl mx-auto glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,0,0,0.15)] backdrop-blur-md">
                <div class="inline-block px-4 py-1.5 rounded-full border border-biotune-red/30 bg-biotune-red/10 text-biotune-red text-sm font-bold uppercase tracking-widest mb-6">
                    Wersja V2: Cząsteczki
                </div>
                
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                    Precyzja w każdym <span class="text-biotune-red">mikrogramie</span>
                </h1>
                
                <p class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Eksploruj najwyższej jakości odczynniki chemiczne i innowacyjne rozwiązania badawcze, zaprojektowane dla profesjonalistów doceniających czystość potwierdzoną badaniami HPLC.
                </p>
                
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="shop.html" class="w-full sm:w-auto bg-biotune-red hover:bg-red-600 text-white font-bold py-4 px-10 rounded-lg uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]">
                        Rozpocznij badania
                    </a>
                    <a href="#about" class="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold py-4 px-10 rounded-lg uppercase tracking-wider transition-all duration-300">
                        Dowiedz się więcej
                    </a>
                </div>
            </div>
            
            <!-- Floating metrics below -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 text-center">
                <div class="glass-hover border-transparent transition-colors p-6 rounded-2xl">
                    <div class="text-3xl font-bold text-white mb-2">>98%</div>
                    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">Gwarancja Czystości</div>
                </div>
                <div class="glass-hover border-transparent transition-colors p-6 rounded-2xl">
                    <div class="text-3xl font-bold text-white mb-2">HPLC</div>
                    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">Weryfikacja Laboratoryjna</div>
                </div>
                <div class="glass-hover border-transparent transition-colors p-6 rounded-2xl">
                    <div class="text-3xl font-bold text-white mb-2">24h</div>
                    <div class="text-sm font-medium text-gray-500 uppercase tracking-wider">Szybka Wysyłka</div>
                </div>
            </div>
        </div>
    </section>

    <!-- TSParticles Library -->
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
        
    <script>
        // Init tsParticles manually due to modular v2
        async function loadParticles(options) {
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
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: true,
                    },
                    modes: {
                        grab: { distance: 200, links: { opacity: 0.5 } }
                    }
                },
                particles: {
                    color: { value: "#ff0000" },
                    links: {
                        color: "#ff0000",
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                    },
                    collisions: { enable: false },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: { default: "bounce" },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: { density: { enable: true, area: 800 }, value: 80 },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { random: true, value: 3 },
                },
                detectRetina: true,
            });
        }
        
        document.addEventListener("DOMContentLoaded", () => {
             loadParticles();
        });
    </script>
`;

content = content.replace(heroRegex, newHero);

fs.writeFileSync(targetPath, (hasBOM ? '\uFEFF' : '') + content, 'utf8');
console.log('V2 Built: index-v2.html updated with TSParticles Hero');
