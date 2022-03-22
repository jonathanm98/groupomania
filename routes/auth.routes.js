const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authDeleteUser } = require("../middlewares/auth");
const multer = require("multer");
// Fonction de multer qui envoie l'image au dossier front et la renomme de façon a eviter les conflit de fichiers
const mimetypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/user");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[^a-zA-Z]/g, "");
    const ext = mimetypes[file.mimetype];
    callback(null, name + Date.now() + "." + ext);
  },
});
const upload = multer({ fileSize: 2097152, storage: storage });

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

router.delete("/delete/:id", authDeleteUser, authController.deleteUser);

router.put("/edit/:id", authDeleteUser, upload.single("file"), authController.editUser);

module.exports = router;
