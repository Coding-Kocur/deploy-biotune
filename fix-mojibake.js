const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'about.html');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
    'Ä…': 'ą',
    'Ä‡': 'ć',
    'Ä™': 'ę',
    'Ĺ‚': 'ł',
    'Ĺ„': 'ń',
    'Ăł': 'ó',
    'Ĺ›': 'ś',
    'Ĺź': 'ź', // Might be Ĺş or Ĺź
    'Ĺş': 'ź',
    'ĹĽ': 'ż',
    'Ă“': 'Ó',
    'Ĺ\u201A': 'ł', // Sometimes Ĺ‚ is parsed as Ĺ + \u201A
    'Ä\u2026': 'ą',
    'Ăł': 'ó',
    'Ĺ›': 'ś',
    'Ä\u2021': 'ć',
    'Ä\u2122': 'ę',
    'Ĺ\u201E': 'ń',
    'Ĺ\u203A': 'ś',
    'Ĺş': 'ź',
    'Ĺź': 'ż',
    'Ĺť': 'Ż',
    'Ĺ\u02DC': 'Ś',
    'Ä\u0104': 'Ą',
    'Ä\u0106': 'Ć',
    'Ä\u02DB': 'Ę',
    'Ĺ\u0141': 'Ł',
    'Ĺ\u0143': 'Ń'
};

// More robust standard Mojibake mapping for Polish
const extendedReplacements = [
    [/Ä\u2026/g, 'ą'],
    [/Ä…/g, 'ą'],
    [/Ä\u2021/g, 'ć'],
    [/Ä‡/g, 'ć'],
    [/Ä\u2122/g, 'ę'],
    [/Ä™/g, 'ę'],
    [/Ĺ‚/g, 'ł'],
    [/Ĺ\u201A/g, 'ł'],
    [/Ĺ\u201E/g, 'ń'],
    [/Ĺ„/g, 'ń'],
    [/Ăł/g, 'ó'],
    [/Ĺ\u203A/g, 'ś'],
    [/Ĺ›/g, 'ś'],
    [/Ĺş/g, 'ź'],
    [/Ĺź/g, 'ż'],
    [/ĹĽ/g, 'ż'],
    [/Ä\u0104/g, 'Ą'],
    [/Ä\u0106/g, 'Ć'],
    [/Ä\u02DB/g, 'Ę'],
    [/Ĺ\u0141/g, 'Ł'],
    [/Ĺ\u0143/g, 'Ń'],
    [/Ă“/g, 'Ó'],
    [/Ĺ\u015A/g, 'Ś'],
    [/Ĺ\u0179/g, 'Ź'],
    [/Ĺ\u017B/g, 'Ż'],
    [/Ĺ»/g, 'Ż']
];

let newContent = content;
for (const [regex, replacement] of extendedReplacements) {
    newContent = newContent.replace(regex, replacement);
}

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed Polish characters in about.html');
