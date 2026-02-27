const fs = require('fs');
const path = require('path');

const filePaths = ['index.html', 'shop.html'];

for (const fp of filePaths) {
    const fullPath = path.join(__dirname, fp);
    if (fs.existsSync(fullPath)) {
        let text = fs.readFileSync(fullPath, 'utf8');

        // The broken characters often appear as a Unicode Replacement Character (U+FFFD)
        // Let's replace the whole words that are currently broken
        text = text.replace(/Docz/g, 'Dołącz');
        text = text.replace(/si/g, 'się');
        text = text.replace(/Wyraam zgod/g, 'Wyrażam zgodę');
        text = text.replace(/powyej/g, 'powyżej');
        text = text.replace(/Imi/g, 'Imię');
        text = text.replace(/Wiadomo/g, 'Wiadomość');
        text = text.replace(/Wiadomo/g, 'Wiadomość'); // in case it was 2 chars
        text = text.replace(/WYLIJ/g, 'WYŚLIJ');
        text = text.replace(/WIADOMO/g, 'WIADOMOŚĆ');

        // Also fix the text in the newsletter section if it degraded to literally containing replacement chars
        text = text.replace(/Do\uFFFDcz/g, 'Dołącz');
        text = text.replace(/si\uFFFD/g, 'się');
        text = text.replace(/Wyra\uFFFDam zgod\uFFFD/g, 'Wyrażam zgodę');
        text = text.replace(/powy\uFFFDej/g, 'powyżej');
        text = text.replace(/Imi\uFFFD/g, 'Imię');
        text = text.replace(/Wiadomo\uFFFD\uFFFD/g, 'Wiadomość');
        text = text.replace(/Wiadomo\uFFFD/g, 'Wiadomość');
        text = text.replace(/WY\uFFFDLIIJ/g, 'WYŚLIJ');
        text = text.replace(/WY\uFFFDLIJ/g, 'WYŚLIJ');
        text = text.replace(/WIADOMO\uFFFD\uFFFD/g, 'WIADOMOŚĆ');
        text = text.replace(/WIADOMO\uFFFD/g, 'WIADOMOŚĆ');

        fs.writeFileSync(fullPath, text, 'utf8');
        console.log('Fixed ' + fp);
    }
}
