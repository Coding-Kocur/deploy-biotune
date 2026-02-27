const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Simpler regex: basically find `if (localStorage.theme === 'dark'` through to the end of the `if/else` block adding/removing 'dark'.
    // Or just look for the typical snippet:
    const regex = /if\s*\(\s*localStorage\.theme\s*===\s*'dark'[^}]+\}[^}]+\}/g;

    // Also remove the `const html = document.documentElement;` typically associated with it.
    let newContent = content.replace(/const html = document\.documentElement;\s*/g, '');
    newContent = newContent.replace(regex, '');

    // also remove the preceding comment `// Theme toggle`
    newContent = newContent.replace(/\/\/\s*Theme\s*toggle\s*/gi, '');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Deep cleaned theme toggle from ${file}`);
    }
});
