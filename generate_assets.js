const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 1. Generate Sequence Frames (180 frames)
const sequenceDir = path.join(__dirname, 'assets', 'sequence');
ensureDir(sequenceDir);

console.log('Generating clean sequence frames (SVG)...');
for (let i = 1; i <= 180; i++) {
    // Subtle change in lightness for "clean" animation
    const lightness = 5 + (i / 180) * 5;

    const svgContent = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="hsl(0, 0%, ${lightness}%)"/>
</svg>`;

    const fileName = `frame_${String(i).padStart(3, '0')}.svg`;
    // Only write if not exists to save time/disk writes if already done
    if (!fs.existsSync(path.join(sequenceDir, fileName))) {
        fs.writeFileSync(path.join(sequenceDir, fileName), svgContent);
    }
}

// 2. Generate Product Placeholders
const productsDir = path.join(__dirname, 'assets', 'products');
ensureDir(productsDir);

// IDs from products-data.js
const products = [
    'retatrutide',
    'bpc-157-tb-500',
    'cjc-1295-ipamorelin',
    'hgh-fragment-176-191',
    'ghk-cu',
    'melanotan-2',
    'pt-141',
    'epithalon',
    'mots-c',
    'semax',
    'selank',
    'bac-water'
];

console.log('Generating product images (SVG)...');
products.forEach(id => {
    // Create a display name from ID for the text inside SVG
    const displayName = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const svgContent = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1a1a1a"/>
    <rect x="2" y="2" width="396" height="396" fill="none" stroke="#333" stroke-width="2"/>
    <text x="50%" y="50%" font-family="Arial" font-size="30" fill="#ff0000" text-anchor="middle" dy=".3em">${displayName}</text>
</svg>`;

    fs.writeFileSync(path.join(productsDir, `${id}.svg`), svgContent);
});

// 3. Generate Generic Placeholder
const assetsDir = path.join(__dirname, 'assets');
const placeholderContent = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#222"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dy=".3em">No Image</text>
</svg>`;
fs.writeFileSync(path.join(assetsDir, 'product-placeholder.png'), placeholderContent); // Saving as .png extension but content is SVG, browser might handle it or we should rename in data. 
// Actually, let's save as .svg and we will update data to point to it or rely on fallback.
// But wait, the current code expects .png in some places. Let's just save a real PNG or use SVG and update code.
// Simpler: Save as .svg, update code to look for .svg.
fs.writeFileSync(path.join(assetsDir, 'product-placeholder.svg'), placeholderContent);


console.log('Clean assets generated successfully!');
