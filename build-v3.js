const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index-v3.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hasBOM = content.charCodeAt(0) === 0xFEFF;
if (hasBOM) content = content.slice(1);

const heroRegex = /<section id="hero"[\s\S]*?<\/section>/;

const newHero = `
    <section id="hero" class="pt-32 pb-0 min-h-screen relative flex flex-col justify-center overflow-hidden bg-biotune-black">
        <div class="w-full relative z-20 px-4 md:px-12 flex flex-col items-center">
            
            <div class="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white text-sm font-bold uppercase tracking-widest mb-12 gsap-fade-up">
                Wersja V3: Kinetyczna Typografia
            </div>

            <div class="text-center max-w-7xl mx-auto">
                <h1 class="text-[12vw] leading-[0.8] font-black text-white tracking-tighter uppercase overflow-hidden mb-2">
                    <span class="inline-block translate-y-full gsap-reveal-text">Czystość.</span>
                </h1>
                <h1 class="text-[12vw] leading-[0.8] font-black text-white tracking-tighter uppercase overflow-hidden mb-2">
                    <span class="inline-block translate-y-full gsap-reveal-text" style="animation-delay: 0.1s">Precyzja.</span>
                </h1>
                <h1 class="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-biotune-red to-red-900 mb-12">
                    <span class="inline-block translate-y-full gsap-reveal-text" style="animation-delay: 0.2s">Rezultaty.</span>
                </h1>
            </div>

            <div class="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mt-12 gap-8 border-t border-white/10 pt-8 gsap-fade-up" style="animation-delay: 0.4s">
                <p class="text-lg text-gray-400 max-w-md text-center md:text-left">
                    Odczynniki chemiczne klasy premium dla środowisk badawczych z rygorystyczną kontrolą HPLC.
                </p>
                
                <a href="shop.html" class="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-transparent border-2 border-biotune-red rounded-none overflow-hidden transition-all duration-300">
                    <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-biotune-red rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                    <span class="absolute inset-0 w-full h-full -mt-1 rounded-none opacity-30 bg-gradient-to-b from-transparent via-transparent to-biotune-red"></span>
                    <span class="relative uppercase tracking-widest">Otwórz Katalog</span>
                    <svg class="relative ml-4 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
            </div>

        </div>
    </section>

    <!-- Custom inline styles for GSAP substitute animations -->
    <style>
        .gsap-reveal-text {
            animation: cubic-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .gsap-fade-up {
            opacity: 0;
            transform: translateY(30px);
            animation: fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes cubic-reveal {
            0% { transform: translateY(110%); }
            100% { transform: translateY(0%); }
        }
        
        @keyframes fade-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }
    </style>
`;

content = content.replace(heroRegex, newHero);

fs.writeFileSync(targetPath, (hasBOM ? '\uFEFF' : '') + content, 'utf8');
console.log('V3 Built: index-v3.html updated with Typography Hero');
