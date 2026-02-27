const fs = require('fs');
const path = require('path');

const dir = './';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Make sure html tag has 'dark'
    content = content.replace(/<html([^>]*)class="([^"]*)"/g, (match, prefix, cls) => {
        if (!cls.includes('dark')) {
            return `<html${prefix}class="${cls} dark"`;
        }
        return match;
    });
    
    // Add dark mode if there are no classes at all in html
    content = content.replace(/<html(?![^>]*class=)([^>]*)>/g, '<html class="scroll-smooth dark" $1>');

    // Remove theme toggle button completely
    content = content.replace(/<!-- Theme toggle with tooltip -->[\s\S]*?(<div class="relative group flex items-center">|<!-- Cart with tooltip -->)/, '$1');

    // Remove JS that toggles the theme
    // We match the block starting with "const themeToggle" or similar down to the listener
    const jsRegex = /\/\/ Theme toggle[\s\S]*?localStorage\.theme[^}]*\}\);/g;
    content = content.replace(jsRegex, '');
    
    const jsRegex2 = /const themeToggle = document\.getElementById\('theme-toggle'\);[\s\S]*?localStorage\.theme[^}]*\}\);/g;
    content = content.replace(jsRegex2, '');

    fs.writeFileSync(filePath, content);
}

function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'deploy-biotune') continue;
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            console.log('Processing:', fullPath);
            processFile(fullPath);
        }
    }
}

walkDir(dir);
console.log('Done.');
