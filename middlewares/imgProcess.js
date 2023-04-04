const sharp = require('sharp');
const fs = require("fs")

module.exports.imgProcess = async (req, res, next) => {
    const type = req.file.destination.split("/")[1]
    const size = type === "user" ? 200 : 700

    if (!req.file) {
        return next();
    }

    const inputPath = req.file.path;
    let outputPath = `p-${req.file.filename}`;

    try {
        let imageType = req.file.mimetype;
        let convertToWebp = false;
        if (imageType === 'image/png' || imageType === 'image/jpeg' || imageType === 'image/jpg' || imageType === 'image/webp') {
            convertToWebp = true;
        } else if (imageType === 'image/gif') {
            // Do nothing for GIFs
            return next();
        }

        let sharpImage = sharp(inputPath);
        if (convertToWebp) {
            sharpImage = sharpImage.webp({ quality: 100 });
            outputPath += '.webp';
        } else {
            outputPath += `.${imageType.split('/')[1]}`;
        }

        await sharpImage
            .resize(size) // Resize the image
            .toFile(`images/${type}/${outputPath}`);

        // Update req.file.filename to the new processed image
        req.file.filename = outputPath;

        // Delete the original uploaded file
        fs.unlinkSync(inputPath);

        next();
    } catch (error) {
        console.error(error);
    }
}