// Resize label from 38x18mm to 38x22mm proportions
// Adds white space between content and red bar

const { Jimp } = require('jimp');
const path = require('path');

const inputPath = 'C:/Users/stani/.gemini/antigravity/brain/c95bb2e0-4332-42c5-9ef5-63166e51ee6c/uploaded_image_1769109779294.png';
const outputDir = 'C:/Users/stani/OneDrive/Pulpit/BioTune/Etykieta';
const outputPath = path.join(outputDir, 'Retatrutide_38x22mm.png');

async function resizeLabel() {
    try {
        // Load the original image
        const image = await Jimp.read(inputPath);

        const originalWidth = image.width;
        const originalHeight = image.height;

        console.log(`Original dimensions: ${originalWidth}x${originalHeight}`);

        // Calculate new height based on 38x22 ratio (was 38x18)
        // New height = original height * (22/18) = originalHeight * 1.222...
        const heightRatio = 22 / 18;
        const newHeight = Math.round(originalHeight * heightRatio);
        const extraHeight = newHeight - originalHeight;

        console.log(`New height: ${newHeight} (adding ${extraHeight}px)`);

        // Create a new canvas with white background
        const newImage = new Jimp({ width: originalWidth, height: newHeight, color: 0xFFFFFFFF });

        // Find where the red bar starts (approximately bottom 12% of image)
        const redBarHeight = Math.round(originalHeight * 0.12);
        const contentHeight = originalHeight - redBarHeight;

        // Copy the top part (gray + white sections) - crop and composite
        const topPart = image.clone().crop({ x: 0, y: 0, w: originalWidth, h: contentHeight });
        newImage.composite(topPart, 0, 0);

        // Copy the red bar to the bottom of the new image
        const bottomPart = image.clone().crop({ x: 0, y: contentHeight, w: originalWidth, h: redBarHeight });
        newImage.composite(bottomPart, 0, newHeight - redBarHeight);

        // Save the result
        await newImage.write(outputPath);

        console.log(`✅ Saved resized label to: ${outputPath}`);
        console.log(`New dimensions: ${originalWidth}x${newHeight}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

resizeLabel();
