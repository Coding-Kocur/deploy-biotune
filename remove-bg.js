const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

const inputPath = 'C:\\Users\\stani\\OneDrive\\Pulpit\\BioTune\\BioTune_Logo\\FinalLogo_MODERN_BiotunePNG.png';
const outputPath = 'C:\\Users\\stani\\.gemini\\antigravity\\scratch\\assets\\biotune-logo-transparent.png';

async function removeBackground() {
    try {
        console.log('Loading image...');
        const image = await Jimp.read(inputPath);

        const width = image.width;
        const height = image.height;
        console.log(`Image size: ${width}x${height}`);

        // Access bitmap directly
        const bitmap = image.bitmap;

        // Scan through all pixels (4 bytes per pixel: RGBA)
        for (let i = 0; i < bitmap.data.length; i += 4) {
            const r = bitmap.data[i];
            const g = bitmap.data[i + 1];
            const b = bitmap.data[i + 2];

            // If pixel is white or very light grey, make it transparent
            if (r > 235 && g > 235 && b > 235) {
                bitmap.data[i + 3] = 0; // Set alpha to 0
            }
        }

        // Save the result
        await image.write(outputPath);
        console.log(`Saved transparent logo to: ${outputPath}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

removeBackground();
