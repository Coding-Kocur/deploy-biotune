import { Jimp } from 'jimp';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
    console.log('Usage: node remove-bg-final.mjs <input> <output>');
    process.exit(1);
}

async function removeWhiteBackground(input, output) {
    try {
        const image = await Jimp.read(input);
        const width = image.width;
        const height = image.height;
        const data = image.bitmap.data;

        // Flood fill from corners to remove background
        // This preserves the product while removing only connected white areas

        const visited = new Set();
        const queue = [];

        // Start from all four corners
        const corners = [
            [0, 0],
            [width - 1, 0],
            [0, height - 1],
            [width - 1, height - 1]
        ];

        // Add edge pixels to queue
        for (let x = 0; x < width; x++) {
            queue.push([x, 0]);
            queue.push([x, height - 1]);
        }
        for (let y = 0; y < height; y++) {
            queue.push([0, y]);
            queue.push([width - 1, y]);
        }

        // Flood fill - find all white pixels connected to edges
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Check if pixel is white/near-white (background)
            if (r > 230 && g > 230 && b > 230) {
                visited.add(key);
                data[idx + 3] = 0; // Make transparent

                // Add neighbors
                queue.push([x + 1, y]);
                queue.push([x - 1, y]);
                queue.push([x, y + 1]);
                queue.push([x, y - 1]);
            }
        }

        await image.write(output);
        console.log(`Background removed with flood fill! Saved to: ${output}`);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

removeWhiteBackground(inputPath, outputPath);
