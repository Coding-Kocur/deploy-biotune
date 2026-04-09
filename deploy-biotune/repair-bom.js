const fs = require('fs');
const path = require('path');

const correctNewsletterHTML = `
    <!-- Newsletter Section -->
    <section class="newsletter-section">
        <h2 class="newsletter-title">Dołącz do naszego newslettera</h2>
        <form class="newsletter-form">
            <div class="newsletter-input-group">
                <input type="email" class="newsletter-input" placeholder="Podaj adres email" required>
                <button type="submit" class="newsletter-button">Zapisz się</button>
            </div>
            <label class="newsletter-consent">
                <input type="checkbox" required>
                <span>Wyrażam zgodę na przetwarzanie podanych powyżej danych osobowych w celu otrzymywania newslettera.</span>
            </label>
            <div class="newsletter-feedback"></div>
        </form>
    </section>
`;

const correctContactHTML = `
    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-black relative overflow-hidden border-t border-white/5 mt-12">
        <div class="max-w-3xl mx-auto px-4 relative z-10">
            <h2 class="text-3xl font-bold mb-8 text-center text-white">SKONTAKTUJ SIĘ Z NAMI</h2>
            <form class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Imię</label>
                    <input type="text" class="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-biotune-red transition-colors text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" class="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-biotune-red transition-colors text-white">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Wiadomość</label>
                    <textarea rows="4" class="w-full bg-transparent border-b border-gray-700 py-2 focus:outline-none focus:border-biotune-red transition-colors text-white"></textarea>
                </div>
                <button type="button" class="w-full bg-biotune-red text-white font-bold py-3 px-6 hover:bg-red-600 transition-colors uppercase tracking-wider">WYŚLIJ WIADOMOŚĆ</button>
            </form>
        </div>
    </section>
`;

const correctSmallFooterHTML = `
    <!-- Footer -->
    <footer class="py-8 border-t border-white/5 text-center text-gray-500 text-sm bg-biotune-dark">
        <p>&copy; 2025 BioTune. Wszelkie prawa zastrzeżone.</p>
        <div class="flex justify-center gap-4 mt-2">
            <a href="regulamin.html" target="_blank" class="hover:text-biotune-red transition-colors">Regulamin</a>
            <span>|</span>
            <a href="privacy.html" target="_blank" class="hover:text-biotune-red transition-colors">Polityka Prywatności</a>
        </div>
    </footer>
`;

function fixFile(fileName) {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) return;

    // Read the file buffer to get rid of BOM if present, then properly decode
    let buf = fs.readFileSync(filePath);
    if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        buf = buf.subarray(3);
    }
    let content = buf.toString('utf8');

    const searchString = content.includes('<!-- Newsletter Section -->') ? '<!-- Newsletter Section -->' : '<!-- Contact Section -->';

    const startClearIdx = content.indexOf('<!-- Newsletter Section -->');
    const startContactIdx = content.indexOf('<!-- Contact Section -->');

    let earliestIdx = -1;
    if (startClearIdx !== -1 && startContactIdx !== -1) earliestIdx = Math.min(startClearIdx, startContactIdx);
    else if (startClearIdx !== -1) earliestIdx = startClearIdx;
    else if (startContactIdx !== -1) earliestIdx = startContactIdx;

    if (earliestIdx !== -1) {
        let endIdx = content.indexOf('<div id="cart-drawer"');

        if (fileName === 'index.html') {
            const footerIdx = content.indexOf('<!-- Footer -->');
            if (footerIdx !== -1 && footerIdx > earliestIdx) {
                endIdx = footerIdx;
            }
        }

        if (endIdx !== -1) {
            const head = content.substring(0, earliestIdx);
            const tail = content.substring(endIdx);

            if (fileName === 'index.html') {
                content = head + correctNewsletterHTML + '\n' + correctContactHTML + '\n' + tail;
            } else {
                content = head + correctNewsletterHTML + '\n' + correctContactHTML + '\n' + correctSmallFooterHTML + '\n' + tail;
            }

            // Write explicitly with UTF-8 BOM so Windows powershell/browsers never mistake the encoding
            const BOM = Buffer.from([0xEF, 0xBB, 0xBF]);
            const contentBuf = Buffer.from(content, 'utf8');
            fs.writeFileSync(filePath, Buffer.concat([BOM, contentBuf]));
            console.log('Fixed BOM and encoding for ' + fileName);
        }
    }
}

fixFile('index.html');
fixFile('shop.html');
