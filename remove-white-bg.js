const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Input and output paths
const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.log('Usage: node remove-white-bg.js <input> <output>');
    process.exit(1);
}

async function removeWhiteBackground(input, output) {
    try {
        const image = sharp(input);
        const metadata = await image.metadata();

        // Get raw pixel data
        const { data, info } = await image
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const { width, height, channels } = info;

        // Process each pixel - make white/near-white pixels transparent
        for (let i = 0; i < data.length; i += channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if pixel is white or near-white (threshold 240)
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }

        // Save the result
        await sharp(data, { raw: { width, height, channels } })
            .png()
            .toFile(output);

        console.log(`Background removed! Saved to: ${output}`);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

removeWhiteBackground(inputPath, outputPath);
