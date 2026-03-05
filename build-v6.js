const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index-v6.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hasBOM = content.charCodeAt(0) === 0xFEFF;
if (hasBOM) content = content.slice(1);

const heroRegex = /<section id="hero"[\s\S]*?<\/section>/;

const newHero = `
    <style>
        .split-container {
            display: flex;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            margin-top: -6rem; /* pull up under navbar */
        }
        
        .split-panel {
            position: relative;
            flex: 1;
            height: 100%;
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
            background-size: cover;
            background-position: center;
            overflow: hidden;
            cursor: pointer;
        }

        .split-panel::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%);
            transition: opacity 0.5s ease;
        }

        .split-container:hover .split-panel {
            flex: 0.5;
        }

        .split-container .split-panel:hover {
            flex: 2.5;
        }

        .split-panel:hover::before {
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(255,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%);
        }
        
        .split-content {
            position: absolute;
            bottom: 10%;
            left: 5%;
            right: 5%;
            color: white;
            opacity: 0.6;
            transition: all 0.5s ease;
            transform: translateY(20px);
        }

        .split-panel:hover .split-content {
            opacity: 1;
            transform: translateY(0);
        }

        .split-title {
            font-size: 2rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(180deg);
            transition: all 0.5s ease;
            white-space: nowrap;
        }

        .split-panel:hover .split-title {
            writing-mode: horizontal-tb;
            transform: translate(0, 0) rotate(0);
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 1rem;
            font-size: 3rem;
        }
        
        .split-desc, .split-btn {
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            transform: translateY(10px);
        }

        .split-panel:hover .split-desc,
        .split-panel:hover .split-btn {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            transition-delay: 0.2s;
        }
    </style>

    <section id="hero" class="p-0 min-h-screen relative flex flex-col justify-center overflow-hidden bg-black">
        
        <!-- UI Notice overlaid on top of panels -->
        <div class="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
            <div class="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white text-sm font-bold uppercase tracking-widest">
                Wersja V6: Interaktywny Hover
            </div>
        </div>

        <div class="split-container z-10">
            <!-- Panel 1: Peptydy -->
            <div class="split-panel" style="background-image: url('./assets/hero/slide-1.jpg');">
                <div class="split-content">
                    <h2 class="split-title">Peptydy</h2>
                    <p class="split-desc text-gray-300 mb-6 max-w-sm">Najwyższej jakości zsyntetyzowane łańcuchy aminokwasów dedykowane zaawansowanym badaniom in-vitro.</p>
                    <a href="shop.html" class="split-btn inline-block bg-biotune-red text-white px-8 py-3 font-bold uppercase tracking-widest rounded hover:bg-red-600 transition-colors">
                        Odkryj
                    </a>
                </div>
            </div>
            
            <!-- Panel 2: SARMY (Placeholder image style) -->
            <div class="split-panel" style="background-image: url('./assets/hero/slide-3.jpg');">
                <div class="split-content">
                    <h2 class="split-title">SARM</h2>
                    <p class="split-desc text-gray-300 mb-6 max-w-sm">Niesteroidowe selektywne modulatory receptora androgenowego. Absolutna czystość strukturalna w każdym miligramie.</p>
                    <a href="shop.html" class="split-btn inline-block bg-biotune-red text-white px-8 py-3 font-bold uppercase tracking-widest rounded hover:bg-red-600 transition-colors">
                        Odkryj
                    </a>
                </div>
            </div>
            
            <!-- Panel 3: Akcesoria -->
            <div class="split-panel" style="background-image: url('./assets/hero/slide-2.png'); border-left: 1px solid rgba(255,255,255,0.1);">
                <div class="split-content">
                    <h2 class="split-title">Lab <span class="text-biotune-red">Gear</span></h2>
                    <p class="split-desc text-gray-300 mb-6 max-w-sm">Certyfikowane szkło laboratoryjne, igły, filtry strzykawkowe i woda bakteriostatyczna niezbędna w pracy chemika.</p>
                    <a href="shop.html" class="split-btn inline-block bg-biotune-red text-white px-8 py-3 font-bold uppercase tracking-widest rounded hover:bg-red-600 transition-colors">
                        Odkryj
                    </a>
                </div>
            </div>
        </div>
        
    </section>
`;

content = content.replace(heroRegex, newHero);

fs.writeFileSync(targetPath, (hasBOM ? '\uFEFF' : '') + content, 'utf8');
console.log('V6 Built: index-v6.html updated with Hover Split-Screen Hero');
