const sharp = require('sharp');
const fs = require("fs")

module.exports.imgProcess = async (req, res, next) => {
    if (!req.file) next()
    const type = req.file.destination.split("/")[1]
    const size = type === "user" ? 300 : 800
    const ext = `.${req.file.mimetype.split("/")[1]}`
    console.log(ext);
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
            return next();
        }

        let sharpImage = sharp(inputPath);
        if (convertToWebp) {
            sharpImage = sharpImage.webp({ quality: 100 });
            outputPath.replace(ext, ".webp");
        } else {
            outputPath += `.${imageType.split('/')[1]}`;
        }

        await sharpImage
            .rotate()
            .resize(size)
            .toFile(`images/${type}/${outputPath}`);

        req.file.filename = outputPath;

        fs.unlinkSync(inputPath);

        next();
    } catch (error) {
        console.error(error);
    }
}