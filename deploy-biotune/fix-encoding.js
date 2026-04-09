const fs = require('fs');
const path = require('path');

function fixEncoding(text) {
    const map = {
        'Ä…': 'ą',
        'Ä‡': 'ć',
        'Ä™': 'ę',
        'Ĺ‚': 'ł',
        'Ĺ„': 'ń',
        'Ăł': 'ó',
        'Ĺ›': 'ś',
        'Ĺş': 'ź',
        'ĹĽ': 'ż',
        'Ä„': 'Ą',
        'Ä†': 'Ć',
        'Ä˜': 'Ę',
        'Ĺ ': 'Ł',
        'Ĺƒ': 'Ń',
        'Ă“': 'Ó',
        'Ĺš': 'Ś',
        'Ĺą': 'Ź',
        'Ĺ»': 'Ż',
        'Â': ''
    };
    let result = text;
    for (const [k, v] of Object.entries(map)) {
        result = result.split(k).join(v);
    }
    return result;
}

const files = ['index.html', 'shop.html'];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = fixEncoding(content);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed encoding in ' + file);
    }
}
