const { Jimp } = require('jimp');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.log('Usage: node remove-bg-jimp.js <input> <output>');
    process.exit(1);
}

async function removeWhiteBackground(input, output) {
    try {
        const image = await Jimp.read(input);
        const width = image.width;
        const height = image.height;

        // Scan through all pixels
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = image.getPixelColor(x, y);
                const rgba = Jimp.intToRGBA(color);

                // If pixel is white or near-white, make it transparent
                if (rgba.r > 235 && rgba.g > 235 && rgba.b > 235) {
                    const transparent = Jimp.rgbaToInt(rgba.r, rgba.g, rgba.b, 0);
                    image.setPixelColor(transparent, x, y);
                }
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
