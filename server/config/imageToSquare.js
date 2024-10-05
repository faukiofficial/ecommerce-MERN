const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ensureSquareImage = async (inputPath, outputPath) => {
  try {
    const image = sharp(inputPath);
    const { width, height } = await image.metadata();

    if (width === height) {
      fs.copyFileSync(inputPath, outputPath);
    } else {
      const size = Math.max(width, height);

      await image
        .resize({
          width: size,
          height: size,
          fit: 'contain', 
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(outputPath);
    }
  } catch (error) {
    console.error('Error ensuring square image:', error);
    throw error;
  }
};

module.exports = ensureSquareImage;
