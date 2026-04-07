const fs = require('fs');
const path = require('path');

const correctNewsletterHTML = `    <!-- Newsletter Section -->
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
    </section>`;

const correctContactHTML = `    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-black relative overflow-hidden border-t border-white/5 mt-12">
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

const correctSmallFooterHTML = `    <!-- Footer -->
    <footer class="py-8 border-t border-white/5 text-center text-gray-500 text-sm bg-biotune-dark">
        <p>&copy; 2025 BioTune. Wszelkie prawa zastrzeżone.</p>
        <div class="flex justify-center gap-4 mt-2">
            <a href="regulamin.html" target="_blank" class="hover:text-biotune-red transition-colors">Regulamin</a>
            <span>|</span>
            <a href="privacy.html" target="_blank" class="hover:text-biotune-red transition-colors">Polityka Prywatności</a>
        </div>
    </footer>`;

function replaceSections(fileName, isIndex) {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) return;

    let buf = fs.readFileSync(filePath);
    let str = buf.toString('utf8');

    const nlIdx = str.indexOf('<!-- Newsletter Section -->');
    if (nlIdx === -1) return;

    let endIdx = -1;
    if (isIndex) {
        endIdx = str.indexOf('<!-- Footer -->');
        if (endIdx === -1) endIdx = str.indexOf('<div id="cart-drawer"');
    } else {
        endIdx = str.indexOf('<div id="cart-drawer"');
    }

    if (endIdx !== -1 && endIdx > nlIdx) {
        const head = str.substring(0, nlIdx);
        const tail = str.substring(endIdx);

        let newContent = head + correctNewsletterHTML + '\n\n' + correctContactHTML + '\n\n';
        if (!isIndex) {
            newContent += correctSmallFooterHTML + '\n\n';
        }
        newContent += tail;

        fs.writeFileSync(filePath, Buffer.from(newContent, 'utf8'));
        console.log('Fixed buffer replacement for ' + fileName);
    }
}

replaceSections('index.html', true);
replaceSections('shop.html', false);
