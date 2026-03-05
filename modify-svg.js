// Script to modify SVG for 38x22mm proportions
// Adds white space by increasing viewBox height and shifting bottom elements

const fs = require('fs');

const inputPath = 'C:/Users/stani/OneDrive/Pulpit/BioTune/Etykieta/Retatrutide 10 (38x22).svg';

let svg = fs.readFileSync(inputPath, 'utf8');

// Original viewBox: "0 0 108 50.999998" (roughly 38:18 ratio)
// New viewBox: "0 0 108 62.4" for 38:22 ratio (50.999998 * 22/18 = 62.4)

const oldHeight = 50.999998;
const newHeight = oldHeight * (22 / 18);
const heightDiff = newHeight - oldHeight; // ~11.4

console.log(`Old height: ${oldHeight}`);
console.log(`New height: ${newHeight}`);
console.log(`Height difference: ${heightDiff}`);

// 1. Update viewBox and height attribute
svg = svg.replace(/viewBox="0 0 108 50\.999998"/g, `viewBox="0 0 108 ${newHeight.toFixed(2)}"`);
svg = svg.replace(/height="68"/g, `height="${Math.round(68 * (22 / 18))}"`);

// 2. The red bar at the bottom is at y=44.957031 - move it down by heightDiff
// The red bar section uses transform="matrix(1, 0, 0, 1, 0, 44)"
svg = svg.replace(/transform="matrix\(1, 0, 0, 1, 0, 44\)"/g, `transform="matrix(1, 0, 0, 1, 0, ${44 + heightDiff})"`);

// Also update the clip-path that references y="44.957031"
svg = svg.replace(/y="44\.957031"/g, `y="${(44.957031 + heightDiff).toFixed(2)}"`);
svg = svg.replace(/44\.957031/g, `${(44.957031 + heightDiff).toFixed(2)}`);

// 3. Update the main background rect height
svg = svg.replace(/y="-5\.1" height="61\.199998"/g, `y="-5.1" height="${(61.199998 + heightDiff).toFixed(2)}"`);

// 4. Shift bottom text elements (the ones in the lower part)
// The text at transform="matrix(1, 0, 0, 1, 55, 28)" needs to move to ~39.4
svg = svg.replace(/matrix\(1, 0, 0, 1, 55, 28\)/g, `matrix(1, 0, 0, 1, 55, ${28 + heightDiff / 2})`);

// Elements at transform="matrix(1, 0, 0, 1, 55, 17)" stay the same (top part) 

// Text at transform="matrix(1, 0, 0, 1, 15, 38)" needs to shift
svg = svg.replace(/matrix\(1, 0, 0, 1, 15, 38\)/g, `matrix(1, 0, 0, 1, 15, ${38 + heightDiff / 2})`);

// Text at transform="matrix(1, 0, 0, 1, 10, 42)" needs to shift
svg = svg.replace(/matrix\(1, 0, 0, 1, 10, 42\)/g, `matrix(1, 0, 0, 1, 10, ${42 + heightDiff / 2})`);

// Text at transform="matrix(1, 0, 0, 1, 19, 29)" shift (CAS line)
svg = svg.replace(/matrix\(1, 0, 0, 1, 19, 29\)/g, `matrix(1, 0, 0, 1, 19, ${29 + heightDiff / 2})`);

// Left column bottom text at transform="matrix(1, 0, 0, 1, 6, 23)" - shift down
svg = svg.replace(/matrix\(1, 0, 0, 1, 6, 23\)/g, `matrix(1, 0, 0, 1, 6, ${23 + heightDiff / 2})`);

// Write the modified SVG
fs.writeFileSync(inputPath, svg, 'utf8');

console.log(`✅ Modified SVG saved to: ${inputPath}`);
console.log(`New proportions: 38x22mm (viewBox: 0 0 108 ${newHeight.toFixed(2)})`);
