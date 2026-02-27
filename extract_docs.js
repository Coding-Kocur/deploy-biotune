const mammoth = require("mammoth");
const fs = require("fs");

const files = [
    "C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Artem\\Plan Treningowy Artem.docx",
    "C:\\Users\\stani\\OneDrive\\Pulpit\\Plany\\Artem\\Suplementacja Artem.docx"
];

async function extract() {
    for (const path of files) {
        console.log(`\n--- READING: ${path} ---`);
        try {
            const buffer = fs.readFileSync(path);
            const result = await mammoth.extractRawText({ buffer: buffer });
            console.log(result.value);
            console.log("--- END ---");
        } catch (e) {
            console.error(`Error reading ${path}:`, e.message);
        }
    }
}

extract();
