const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index-v4.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hasBOM = content.charCodeAt(0) === 0xFEFF;
if (hasBOM) content = content.slice(1);

const heroRegex = /<section id="hero"[\s\S]*?<\/section>/;

const newHero = `
    <section id="hero" class="pt-24 pb-0 min-h-screen relative flex flex-col justify-center overflow-hidden bg-black">
        
        <!-- WebGL Topology Container -->
        <div id="vanta-bg" class="absolute inset-0 z-0"></div>
        
        <!-- Dark gradient overlay to ensure text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-biotune-black via-black/40 to-black/80 pointer-events-none z-10"></div>
        
        <div class="w-full relative z-20 text-center px-4 md:px-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
            
            <!-- Left Info Panel -->
            <div class="flex-1 text-left">
                <div class="inline-block px-4 py-1.5 rounded-full border border-biotune-red/30 bg-biotune-red/10 text-biotune-red text-sm font-bold uppercase tracking-widest mb-6">
                    Wersja V4: Siatka 3D
                </div>
                
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                    Przyszłość <br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-biotune-red to-red-600">Eksploracji</span>
                </h1>
                
                <p class="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
                    Wejdź w nowy wymiar badań z absolutną precyzją. Oferujemy odczynniki chemiczne testowane za pomocą spektrometrii mas i chromatografii cieczowej.
                </p>
                
                <div class="flex flex-col sm:flex-row items-start gap-4">
                    <a href="shop.html" class="group relative px-8 py-4 font-bold text-white bg-biotune-red rounded overflow-hidden transition-all duration-300">
                        <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                        <span class="relative uppercase tracking-wider">Katalog Produktów</span>
                    </a>
                </div>
            </div>

            <!-- Right Glass Panel for Features -->
            <div class="w-full md:w-5/12 grid grid-cols-1 gap-4">
                <div class="glass p-6 rounded-lg border border-white/10 border-l-4 border-l-biotune-red hover:bg-white/5 transition-colors transform hover:translate-x-2 duration-300">
                    <h3 class="text-xl font-bold text-white mb-1">Czystość >98%</h3>
                    <p class="text-sm text-gray-400">Restrykcyjna kontrola każdej partii.</p>
                </div>
                <div class="glass p-6 rounded-lg border border-white/10 border-l-4 border-l-gray-500 hover:bg-white/5 transition-colors transform hover:translate-x-2 duration-300">
                    <h3 class="text-xl font-bold text-white mb-1">Certyfikaty HPLC</h3>
                    <p class="text-sm text-gray-400">Transparentność i pełna dokumentacja wyników testów niezależnych laboratoriów.</p>
                </div>
                <div class="glass p-6 rounded-lg border border-white/10 border-l-4 border-l-gray-500 hover:bg-white/5 transition-colors transform hover:translate-x-2 duration-300">
                    <h3 class="text-xl font-bold text-white mb-1">Wysyłka w 24H</h3>
                    <p class="text-sm text-gray-400">Bezpieczny, klimatyzowany transport paczek.</p>
                </div>
            </div>
            
        </div>
    </section>

    <!-- Vanta.js & Three.js requirements -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js"></script>
    
    <script>
        document.addEventListener("DOMContentLoaded", () => {
             VANTA.TOPOLOGY({
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
        });
    </script>
`;

content = content.replace(heroRegex, newHero);

fs.writeFileSync(targetPath, (hasBOM ? '\uFEFF' : '') + content, 'utf8');
console.log('V4 Built: index-v4.html updated with WebGL Topology Hero');
