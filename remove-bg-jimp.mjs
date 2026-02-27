import { Jimp } from 'jimp';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.log('Usage: node remove-bg-jimp.mjs <input> <output>');
    process.exit(1);
}

async function removeWhiteBackground(input, output) {
    try {
        const image = await Jimp.read(input);
        const width = image.width;
        const height = image.height;

        // Get raw bitmap data
        const data = image.bitmap.data;

        // Scan through all pixels (RGBA format, 4 bytes per pixel)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If pixel is white or near-white, make it transparent
            if (r > 235 && g > 235 && b > 235) {
                data[i + 3] = 0; // Set alpha to 0
            }
        }

        await image.write(output);
        console.log(`Background removed! Saved to: ${output}`);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

removeWhiteBackground(inputPath, outputPath);
