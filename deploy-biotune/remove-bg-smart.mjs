import { Jimp } from 'jimp';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.log('Usage: node remove-bg-smart.mjs <input> <output>');
    process.exit(1);
}

async function removeWhiteBackground(input, output) {
    try {
        const image = await Jimp.read(input);
        const width = image.width;
        const height = image.height;
        const data = image.bitmap.data;

        // Only remove pixels that are VERY close to pure white (threshold 250+)
        // AND are in the outer "border" region of the image
        // This preserves the product in the center while removing the white background

        const centerX = width / 2;
        const centerY = height / 2;
        const productRadius = Math.min(width, height) * 0.35; // Approximate product area

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Check if pixel is VERY white (>250 for all channels)
                const isVeryWhite = r > 250 && g > 250 && b > 250;

                // Calculate distance from center
                const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

                // Only remove if very white OR (white-ish and far from center)
                if (isVeryWhite) {
                    data[idx + 3] = 0; // Make transparent
                } else if (r > 245 && g > 245 && b > 245 && distFromCenter > productRadius) {
                    data[idx + 3] = 0; // Make transparent
                }
            }
        }

        await image.write(output);
        console.log(`Background removed smartly! Saved to: ${output}`);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

removeWhiteBackground(inputPath, outputPath);
