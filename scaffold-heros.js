const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname);
const indexPath = path.join(srcDir, 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('index.html not found');
    process.exit(1);
}

// Ensure BOM on read
let indexContent = fs.readFileSync(indexPath, 'utf8');
const hasBOM = indexContent.charCodeAt(0) === 0xFEFF;
if (hasBOM) {
    indexContent = indexContent.slice(1);
}

// 1. Prepare Navigation Block to Inject
const navLinkToReplace = `<a href="about.html"
                        class="hover:text-biotune-red transition-colors px-3 py-2 rounded-md text-sm font-medium">O
                        Nas</a>`;

const newNavBlock = `<div class="dropdown-trigger">
                        <a href="index.html"
                            class="hover:text-biotune-red transition-colors px-3 py-2 rounded-md text-sm font-medium inline-flex items-center text-biotune-red">
                            Wersje Hero
                            <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </a>
                        <div class="dropdown-menu">
                            <div class="py-1">
                                <a href="index.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V1: Oryginał</a>
                                <a href="index-v2.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V2: Cząsteczki (Particles)</a>
                                <a href="index-v3.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V3: Typografia (GSAP)</a>
                                <a href="index-v4.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V4: Siatka 3D (WebGL)</a>
                                <a href="index-v5.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V5: Kinematografia (Video)</a>
                                <a href="index-v6.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black/20 hover:text-biotune-red">V6: Split-Screen Hover</a>
                            </div>
                        </div>
                    </div>
                    ` + navLinkToReplace;

// Let's create the 5 identical variations first, we will swap the Hero content out manually later
const variations = [2, 3, 4, 5, 6];

// Add the new nav block to the base template
let updatedBaseContent = indexContent.replace(navLinkToReplace, newNavBlock);

// Save back index.html with the new nav
fs.writeFileSync(indexPath, (hasBOM ? '\uFEFF' : '') + updatedBaseContent, 'utf8');
console.log('Updated index.html with global navigation');

// Generate clones for V2-V6
variations.forEach(v => {
    const vPath = path.join(srcDir, `index-v${v}.html`);
    fs.writeFileSync(vPath, (hasBOM ? '\uFEFF' : '') + updatedBaseContent, 'utf8');
    console.log(`Generated ${vPath}`);
});

// Update the rest of the main HTML pages with the new nav so it's global
const pagesToUpdate = ['shop.html', 'about.html', 'product.html'];

pagesToUpdate.forEach(page => {
    const pagePath = path.join(srcDir, page);
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        const fileHasBom = content.charCodeAt(0) === 0xFEFF;
        if (fileHasBom) content = content.slice(1);

        if (!content.includes('Wersje Hero')) {
            content = content.replace(navLinkToReplace, newNavBlock);
            fs.writeFileSync(pagePath, (fileHasBom ? '\uFEFF' : '') + content, 'utf8');
            console.log(`Updated ${pagePath} with global navigation`);
        }
    }
});

console.log('Scaffolding complete.');
