const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authEditUser, auth } = require("../middlewares/auth");
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

router.get("/get/:id", authEditUser, authController.getOneUser)

router.delete("/delete/:id", authEditUser, authController.deleteUser);

router.put("/edit/picture/:id", authEditUser, upload.single("file"), authController.editUserImg);

router.put("/edit/bio/:id", authEditUser, authController.editUserBio);

router.get("/auth", auth)

module.exports = router;
