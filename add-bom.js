const fs = require('fs');
const path = require('path');

function addBOM(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);

    items.forEach(fileName => {
        const filePath = path.join(dir, fileName);
        if (fs.statSync(filePath).isDirectory()) {
            addBOM(filePath);
            return;
        }

        if (!fileName.endsWith('.html')) return;

        let content = fs.readFileSync(filePath, 'utf8');

        // Remove existing BOM if present to avoid doubling it
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        // Prepend BOM
        const contentWithBOM = '\uFEFF' + content;

        fs.writeFileSync(filePath, contentWithBOM, 'utf8');
        console.log('Added BOM to ' + filePath);
    });
}

addBOM(__dirname);
console.log('Finished adding BOM');
