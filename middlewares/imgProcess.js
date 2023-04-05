const sharp = require('sharp');
const fs = require("fs")


// Middleware de traitement d'image qui va compresser les images après les avoir stocké dans le serveur
module.exports.imgProcess = async (req, res, next) => {
    // Si il n'y a pas d'image on passe la fonction
    if (!req.file) {
        return next();
    }
    const type = req.file.destination.split("/")[1]
    // size est une variable qui va définir la taille max de l'image selon si c'est une image d'utilisateur ou de post 
    const size = type === "user" ? 300 : 800
    // on récup^ère l'extension du fichier pour la remplacer par la suite
    const ext = `.${req.file.mimetype.split("/")[1]}`

    // Nom original du fichier
    const inputPath = req.file.path;
    // Nom du fichier traité
    const outputPath = `p-${req.file.filename}`;

    try {
        const imageType = req.file.mimetype;
        let convertToWebp = false;
        // Si mon fichier est jpg, jpeg, png, webp on execute la fonction
        if (imageType === 'image/png' || imageType === 'image/jpeg' || imageType === 'image/jpg' || imageType === 'image/webp') {
            convertToWebp = true;
            //Sinon on passe à la suite
        } else {
            return next();
        }

        // On déclare le fichier qui doit être traité par sharp
        let sharpImage = sharp(inputPath);
        // Si le fichier est dans un format compressible, nous le convertissons en format webp
        if (convertToWebp) {
            sharpImage = sharpImage.webp({ quality: 100 });
            outputPath.replace(ext, ".webp");
            // Sinon le fichier garde son extention/format d'origine
        } else {
            outputPath += `.${imageType.split('/')[1]}`;
        }

        // Traitement de l'image
        await sharpImage
            // Utilisation de rotate() car sans ça le fait d'utiliser resize() tourne mon image a 90° selon le ratio
            .rotate()
            // resize() au format adapté
            .resize(size)
            // Et enfin on envoie le fichier dans le dossier approprié 
            .toFile(`images/${type}/${outputPath}`);

        // On change le nom du fichier pour que multer puisse ensuite le traiter correctement
        req.file.filename = outputPath;

        // Et enfin on supprime le fichier d'origine
        fs.unlinkSync(inputPath);

        next();
    } catch (error) {
        console.error(error);
    }
}