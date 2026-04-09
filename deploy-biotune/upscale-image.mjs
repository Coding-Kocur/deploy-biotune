import { Jimp } from 'jimp';

const refPath = 'C:/Users/stani/.gemini/antigravity/brain/c95bb2e0-4332-42c5-9ef5-63166e51ee6c/uploaded_image_1768005957645.jpg';
const srcPath = 'C:/Users/stani/.gemini/antigravity/brain/c95bb2e0-4332-42c5-9ef5-63166e51ee6c/slu_pp_332_fixed_1768006069917.png';
const outPath = 'C:/Users/stani/.gemini/antigravity/brain/c95bb2e0-4332-42c5-9ef5-63166e51ee6c/slu_pp_332_upscaled.png';

async function upscale() {
    // Get reference dimensions
    const ref = await Jimp.read(refPath);
    const targetWidth = ref.width;
    const targetHeight = ref.height;
    console.log('Reference size:', targetWidth, 'x', targetHeight);

    // Load source and resize
    const src = await Jimp.read(srcPath);
    console.log('Source size:', src.width, 'x', src.height);

    // Resize to match reference
    src.resize({ w: targetWidth, h: targetHeight });

    await src.write(outPath);
    console.log('Saved upscaled image to:', outPath);
}

upscale().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
