const { Jimp } = require('jimp');

const inputPath = 'C:\\Users\\stani\\OneDrive\\Pulpit\\BioTune\\BioTune_Logo\\Untitled design.png';
const outputPath = 'C:\\Users\\stani\\.gemini\\antigravity\\scratch\\assets\\biotune-logo-dark-mode.png';

async function processLogo() {
    try {
        console.log('Loading image...');
        const image = await Jimp.read(inputPath);

        const width = image.width;
        const height = image.height;
        console.log(`Image size: ${width}x${height}`);

        const bitmap = image.bitmap;
        let pixelsModified = 0;

        // Target grey brightness for "Tune" text
        const TARGET_GREY = 215;

        for (let i = 0; i < bitmap.data.length; i += 4) {
            const r = bitmap.data[i];
            const g = bitmap.data[i + 1];
            const b = bitmap.data[i + 2];
            const alpha = bitmap.data[i + 3];

            // Skip already transparent pixels
            if (alpha === 0) continue;

            // Calculate brightness
            const brightness = (r + g + b) / 3;

            // Check if pixel is RED (Bio text and symbol)
            const isRed = r > 100 && r > g * 1.4 && r > b * 1.4;

            // If pixel is very dark (background), make it transparent
            // Use alpha blending for semi-dark pixels to preserve anti-aliasing
            if (brightness < 40) {
                // Fade to transparent based on darkness
                const newAlpha = Math.max(0, Math.round((brightness / 40) * alpha));
                bitmap.data[i + 3] = newAlpha;
                pixelsModified++;
            }
            // For grey pixels (not red), preserve anti-aliasing by scaling
            else if (!isRed) {
                // Calculate how "grey" this pixel is (vs black edge)
                // Edge pixels are darker, center pixels are brighter
                // Scale the target grey based on original brightness ratio
                const maxOriginalBrightness = 180; // Approximate max grey in original
                const brightnessRatio = Math.min(1, brightness / maxOriginalBrightness);

                // Apply ratio to target grey to preserve anti-aliased edges
                const scaledGrey = Math.round(TARGET_GREY * brightnessRatio);

                bitmap.data[i] = scaledGrey;
                bitmap.data[i + 1] = scaledGrey;
                bitmap.data[i + 2] = scaledGrey;
                pixelsModified++;
            }
        }

        console.log(`Modified ${pixelsModified} pixels with anti-aliasing preserved`);

        await image.write(outputPath);
        console.log(`Saved processed logo to: ${outputPath}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

processLogo();
