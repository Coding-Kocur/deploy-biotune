const fs = require('fs');
const path = require('path');

const correctFooterHTML = `    <!-- Footer -->
    <footer class="bg-[#121212] pt-16 pb-8 border-t border-white/10 relative overflow-hidden z-20 w-full mt-12 mb-0">
        <!-- Glowing Background orb -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-biotune-red/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                <!-- Logo & Bio -->
                <div class="lg:col-span-2">
                    <a href="index.html" class="inline-block mb-6">
                        <span class="text-3xl font-bold text-white tracking-tighter">Bio<span class="text-biotune-red">Tune</span></span>
                    </a>
                    <p class="text-gray-400 leading-relaxed max-w-sm">
                        Ekspert w dziedzinie odczynników chemicznych do celów laboratoryjnych i innowacyjnych rozwiązań badawczych. Dostarczamy najwyższą jakość potwierdzoną dokumentacją.
                    </p>
                </div>

                <!-- Kategorie -->
                <div>
                    <h4 class="text-white font-bold mb-6 tracking-wider text-sm uppercase">Kategorie</h4>
                    <ul class="space-y-4">
                        <li><a href="index.html" class="text-gray-400 hover:text-white transition-colors text-sm">Strona główna</a></li>
                        <li><a href="about.html" class="text-gray-400 hover:text-white transition-colors text-sm">O nas</a></li>
                        <li><a href="shop.html" class="text-gray-400 hover:text-white transition-colors text-sm">Sklep</a></li>
                    </ul>
                </div>

                <!-- Informacja -->
                <div>
                    <h4 class="text-white font-bold mb-6 tracking-wider text-sm uppercase">Informacja</h4>
                    <ul class="space-y-4">
                        <li><a href="regulamin.html" class="text-gray-400 hover:text-white transition-colors text-sm">Regulamin sklepu</a></li>
                        <li><a href="privacy.html" class="text-gray-400 hover:text-white transition-colors text-sm">Polityka prywatności</a></li>
                        <li><a href="#contact" class="text-gray-400 hover:text-white transition-colors text-sm">Kontakt</a></li>
                    </ul>
                </div>

            </div>

            <!-- Divider -->
            <div class="w-full h-px bg-white/10 mb-8" id="footer-contact"></div>

            <!-- Contact & Socials -->
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">

                <div class="flex flex-col sm:flex-row gap-8">
                    <div class="flex items-center gap-4 group cursor-pointer">
                        <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-biotune-red group-hover:border-biotune-red transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-300 group-hover:text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">E-mail informacyjny</p>
                            <p class="text-white text-sm font-medium">kontakt@biotune.pl</p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <!-- Instagram -->
                    <a href="#" class="text-gray-500 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>

            <div class="mt-8 text-center md:text-left text-[11px] text-gray-500 font-mono">
                &copy; 2026 BioTune. Wszelkie prawa zastrzeżone. Projekt o charakterze wyłącznie badawczym i naukowym.
            </div>
        </div>
    </footer>`;

const correctContactHTML = `    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-black relative overflow-hidden mt-12">
        <div class="max-w-3xl mx-auto px-4 relative z-10">
            <h2 class="text-3xl font-bold mb-8 text-center text-white">SKONTAKTUJ SIĘ Z NAMI</h2>
            <form class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Imię</label>
                    <input type="text"
                        class="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-biotune-red transition-colors text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input type="email"
                        class="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-biotune-red transition-colors text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Wiadomość</label>
                    <textarea rows="4"
                        class="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-biotune-red transition-colors text-white"></textarea>
                </div>
                <button type="button"
                    class="w-full bg-biotune-red text-white font-bold py-3 px-6 hover:bg-red-600 transition-colors uppercase tracking-wider">WYŚLIJ WIADOMOŚĆ</button>
            </form>
        </div>
    </section>`;

const extendedReplacements = [
    [/âš ď¸Ź/g, '⚠️'], // Warning emoji
    [/Ä\u2026/g, 'ą'],
    [/Ä…/g, 'ą'],
    [/Ä\u2021/g, 'ć'],
    [/Ä‡/g, 'ć'],
    [/Ä\u2122/g, 'ę'],
    [/Ä™/g, 'ę'],
    [/Ĺ‚/g, 'ł'],
    [/Ĺ\u201A/g, 'ł'],
    [/Ĺ\u201E/g, 'ń'],
    [/Ĺ„/g, 'ń'],
    [/Ăł/g, 'ó'],
    [/Ĺ\u203A/g, 'ś'],
    [/Ĺ›/g, 'ś'],
    [/Ĺş/g, 'ź'],
    [/Ĺź/g, 'ż'],
    [/ĹĽ/g, 'ż'],
    [/Ä\u0104/g, 'Ą'],
    [/Ä\u0106/g, 'Ć'],
    [/Ä\u02DB/g, 'Ę'],
    [/Ĺ\u0141/g, 'Ł'],
    [/Ĺ\u0143/g, 'Ń'],
    [/Ă“/g, 'Ó'],
    [/Ĺ\u015A/g, 'Ś'],
    [/Ĺ\u0179/g, 'Ź'],
    [/Ĺ\u017B/g, 'Ż'],
    [/Ĺ»/g, 'Ż']
];

function processPath(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);

    items.forEach(fileName => {
        const filePath = path.join(dir, fileName);
        if (fs.statSync(filePath).isDirectory()) {
            // Recurse into subdirectories (like deploy-biotune)
            processPath(filePath);
            return;
        }

        if (!fileName.endsWith('.html')) return;

        let h = fs.readFileSync(filePath, 'utf8');
        let originalHtml = h;

        // 1. Fix Mojibake
        for (const [regex, replacement] of extendedReplacements) {
            h = h.replace(regex, replacement);
        }

        // 2. Add Contact Form to about.html if missing
        if (fileName === 'about.html') {
            if (!h.includes('id="contact"')) {
                // Find where to put it
                let startF = h.indexOf('<footer');
                if (startF === -1) startF = h.indexOf('<!-- Footer -->');
                if (startF !== -1) {
                    h = h.substring(0, startF) + '\n' + correctContactHTML + '\n\n' + h.substring(startF);
                } else {
                    const cartIdx = h.indexOf('<div id="cart-drawer"');
                    if (cartIdx !== -1) {
                        h = h.substring(0, cartIdx) + '\n' + correctContactHTML + '\n' + h.substring(cartIdx);
                    }
                }
            }
        }

        // 3. Replace Footer completely
        let startFooterNode = h.indexOf('<footer');
        if (startFooterNode === -1) {
            startFooterNode = h.indexOf('<!-- Footer -->');
        }

        if (startFooterNode !== -1) {
            // Find end of footer
            const endFooterNode = h.indexOf('</footer>', startFooterNode);
            if (endFooterNode !== -1) {
                let actualEnd = endFooterNode + 9;

                let beforeFooter = h.substring(0, startFooterNode);
                const commentMatch = beforeFooter.match(/<!--\s*Footer\s*-->\s*$/i);
                if (commentMatch) {
                    beforeFooter = beforeFooter.substring(0, beforeFooter.length - commentMatch[0].length);
                }

                const afterFooter = h.substring(actualEnd);
                h = beforeFooter + '\n' + correctFooterHTML + '\n' + afterFooter;
            }
        } else if (fileName === 'shop.html' || fileName === 'product.html' || fileName === 'index.html' || fileName === 'about.html') {
            // If missing a footer completely, append it where it belongs
            const cartIdx = h.indexOf('<div id="cart-drawer"');
            if (cartIdx !== -1) {
                h = h.substring(0, cartIdx) + '\n' + correctFooterHTML + '\n' + h.substring(cartIdx);
            } else {
                const bodyIdx = h.indexOf('</body>');
                if (bodyIdx !== -1) {
                    h = h.substring(0, bodyIdx) + '\n' + correctFooterHTML + '\n' + h.substring(bodyIdx);
                }
            }
        }

        if (h !== originalHtml) {
            fs.writeFileSync(filePath, h, 'utf8');
            console.log("Processed and fixed " + filePath);
        }
    });
}

processPath(__dirname);
