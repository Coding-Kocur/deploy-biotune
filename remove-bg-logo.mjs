import { Jimp } from 'jimp';

const inputPath = 'C:/Users/stani/.gemini/antigravity/brain/c95bb2e0-4332-42c5-9ef5-63166e51ee6c/uploaded_image_0_1767995760210.png';
const outputPath = 'C:/Users/stani/.gemini/antigravity/scratch/assets/biotune-logo-white-bg.png';

async function removeGreyBackground() {
    console.log('Loading image...');
    const image = await Jimp.read(inputPath);

    const width = image.width;
    const height = image.height;

    console.log(`Image size: ${width}x${height}`);

    // The grey background color from the label is approximately #baccd1
    // We'll replace pixels that are close to this grey with white

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = image.getPixelColor(x, y);

            // Extract RGBA from the color integer
            const red = (color >> 24) & 0xFF;
            const green = (color >> 16) & 0xFF;
            const blue = (color >> 8) & 0xFF;
            const alpha = color & 0xFF;

            // Check if pixel is close to the grey background (#baccd1 = 186, 204, 209)
            const isGreyBackground = (
                red > 170 && red < 215 &&
                green > 185 && green < 220 &&
                blue > 190 && blue < 225
            );

            // Also catch any very light pixels that are almost white/grey
            const isLightGrey = (
                red > 210 && green > 210 && blue > 210 &&
                Math.abs(red - green) < 25 && Math.abs(green - blue) < 25
            );

            if (isGreyBackground || isLightGrey) {
                // Replace with pure white (0xFFFFFFFF)
                image.setPixelColor(0xFFFFFFFF, x, y);
            }
        }
    }

    console.log('Background removed, saving...');
    await image.write(outputPath);
    console.log(`Done! Saved to: ${outputPath}`);
}

removeGreyBackground().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
