const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index-v5.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hasBOM = content.charCodeAt(0) === 0xFEFF;
if (hasBOM) content = content.slice(1);

const heroRegex = /<section id="hero"[\s\S]*?<\/section>/;

const newHero = `
    <section id="hero" class="pt-0 pb-0 min-h-screen relative flex flex-col justify-center overflow-hidden bg-black mt-[-6rem]">
        
        <!-- Video Background Container -->
        <div class="absolute inset-0 z-0 overflow-hidden">
            <video autoplay loop muted playsinline class="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 mix-blend-screen mix-blend-luminosity filter grayscale contrast-125 sepia-[.3] hue-rotate-[320deg]">
                <!-- Example high quality science stock placeholder -->
                <source src="https://cdn.pixabay.com/video/2020/02/03/31835-388915077_large.mp4" type="video/mp4">
            </video>
        </div>
        
        <!-- Deep Red Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-tr from-biotune-black via-black/70 to-red-900/40 mix-blend-multiply pointer-events-none z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-biotune-black via-transparent to-black/80 pointer-events-none z-10"></div>
        
        <!-- Content -->
        <div class="w-full relative z-20 text-center px-4 flex flex-col items-center justify-center mt-32">
            
            <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/50 border border-white/20 backdrop-blur-md mb-8">
                <span class="w-2 h-2 rounded-full bg-biotune-red animate-pulse"></span>
                <span class="text-white text-sm font-bold tracking-widest uppercase">Wersja V5: Kinematografia</span>
            </div>
            
            <h1 class="text-6xl md:text-8xl lg:text-[8rem] font-bold text-white tracking-tighter mb-4 leading-none mix-blend-screen text-shadow">
                BIOTUNE
            </h1>
            
            <p class="text-xl md:text-2xl text-gray-300 font-light tracking-widest uppercase mb-12 max-w-3xl mx-auto drop-shadow-lg">
                Zaufaj Nauce. Wymagaj Precyzji.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-6 mt-8">
                <a href="shop.html" class="relative group overflow-hidden bg-white text-black font-bold py-4 px-12 rounded-full uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105">
                    <span class="relative z-10 group-hover:text-white transition-colors duration-300">Przeglądaj Produkty</span>
                    <div class="absolute inset-0 h-full w-0 bg-biotune-red transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                </a>
                <a href="#about" class="flex items-center justify-center gap-3 text-white font-bold py-4 px-8 rounded-full uppercase tracking-wide text-sm border-2 border-white/20 hover:border-white transition-all backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                    </svg>
                    <span>Nasza Misja</span>
                </a>
            </div>
            
            <!-- Mouse scroll indicator -->
            <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70">
                <span class="text-xs text-white uppercase tracking-widest mb-2 font-bold">Zjedź W Dół</span>
                <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div class="w-1 h-2 bg-white rounded-full"></div>
                </div>
            </div>
            
        </div>
    </section>
`;

content = content.replace(heroRegex, newHero);

fs.writeFileSync(targetPath, (hasBOM ? '\uFEFF' : '') + content, 'utf8');
console.log('V5 Built: index-v5.html updated with Cinematic Video Hero');
