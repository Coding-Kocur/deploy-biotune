import { Jimp } from 'jimp';

const inputPath = 'C:/Users/stani/.gemini/antigravity/scratch/assets/biotune-logo-white-bg.png';
const outputPath = 'C:/Users/stani/.gemini/antigravity/scratch/assets/biotune-logo-sharp.png';

async function sharpenLogo() {
    console.log('Loading image...');
    const image = await Jimp.read(inputPath);

    const width = image.width;
    const height = image.height;

    console.log(`Image size: ${width}x${height}`);

    // Create a copy for reading original values
    const original = image.clone();

    // Apply sharpen kernel manually
    // Sharpen kernel: [0, -1, 0], [-1, 5, -1], [0, -1, 0]

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            // Get surrounding pixels from original
            const center = original.getPixelColor(x, y);
            const top = original.getPixelColor(x, y - 1);
            const bottom = original.getPixelColor(x, y + 1);
            const left = original.getPixelColor(x - 1, y);
            const right = original.getPixelColor(x + 1, y);

            // Extract RGB for each
            const extractRGB = (color) => ({
                r: (color >> 24) & 0xFF,
                g: (color >> 16) & 0xFF,
                b: (color >> 8) & 0xFF,
                a: color & 0xFF
            });

            const c = extractRGB(center);
            const t = extractRGB(top);
            const bo = extractRGB(bottom);
            const l = extractRGB(left);
            const r = extractRGB(right);

            // Apply sharpen kernel
            let newR = Math.round(c.r * 5 - t.r - bo.r - l.r - r.r);
            let newG = Math.round(c.g * 5 - t.g - bo.g - l.g - r.g);
            let newB = Math.round(c.b * 5 - t.b - bo.b - l.b - r.b);

            // Clamp values
            newR = Math.max(0, Math.min(255, newR));
            newG = Math.max(0, Math.min(255, newG));
            newB = Math.max(0, Math.min(255, newB));

            // Reconstruct color
            const newColor = ((newR << 24) | (newG << 16) | (newB << 8) | c.a) >>> 0;
            image.setPixelColor(newColor, x, y);
        }
    }

    console.log('Sharpening complete, saving...');
    await image.write(outputPath);
    console.log(`Done! Saved to: ${outputPath}`);
}

sharpenLogo().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
