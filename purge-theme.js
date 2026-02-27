const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const themeToggleRegex = /\/\/ Theme toggle[\s\S]*?html\.classList\.remove\('dark'\);\s*}/;
const altThemeToggleRegex = /if\s*\(localStorage\.theme === 'dark'[\s\S]*?html\.classList\.remove\('dark'\);\s*}/;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let changed = false;

    // Remove specific block
    if (themeToggleRegex.test(content)) {
        content = content.replace(themeToggleRegex, '');
        changed = true;
    } else if (altThemeToggleRegex.test(content)) {
        content = content.replace(altThemeToggleRegex, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned theme toggle from ${file}`);
    }
});
