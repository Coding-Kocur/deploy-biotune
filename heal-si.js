const fs = require('fs');
const path = require('path');

function healFile(fileName) {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) return;

    let text = fs.readFileSync(filePath, 'utf8');

    // 1. Reverse the global "si -> się"
    // Since we literally replaced all "si" with "się" (and also the uppercase "SI" wasn't affected because the regex was lowercase /si/g, except where I manually injected).
    // Let's replace "się" with "si" unconditionally first to cure transition -> transition.

    text = text.replace(/się/g, 'si');

    // 2. Now surgically restore the few places that *should* be "się"

    // In Navbar & Modals
    text = text.replace(/Zaloguj si,/g, 'Zaloguj się,');
    text = text.replace(/>Zaloguj si</g, '>Zaloguj się<');
    text = text.replace(/>Zarejestruj si</g, '>Zarejestruj się<');

    // In Newsletter 
    text = text.replace(/>Zapisz si</g, '>Zapisz się<');

    // Check if the uppercase contact form was broken, we explicitly placed SKONTAKTUJ SIĘ Z NAMI, so it might have stayed SIĘ. If it became SI, let's fix it.
    text = text.replace(/SKONTAKTUJ SI Z NAMI/g, 'SKONTAKTUJ SIĘ Z NAMI');

    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Healed ' + fileName);
}

healFile('index.html');
healFile('shop.html');
