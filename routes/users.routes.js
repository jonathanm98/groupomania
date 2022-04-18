const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const { authEditUser, auth, authView } = require("../middlewares/auth");
const multer = require("multer");

// Fonction de multer qui envoie l'image au dossier images/user et la renomme de façon a eviter les conflit de fichiers
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

router.post("/login", usersController.login);
router.post("/register", usersController.register);
router.get("/logout", usersController.logout);

router.get("/get/all", authView, usersController.getAllUsers)
router.get("/get/", authEditUser, usersController.getCurrentUser)
router.get("/get/:id", authView, usersController.getOneUser)

router.delete("/delete/:id", authEditUser, usersController.deleteUser);

router.put("/edit/picture/:id", authEditUser, upload.single("file"), usersController.editUserImg);

router.put("/edit/bio/:id", authEditUser, usersController.editUserBio);

router.get("/auth", auth)

module.exports = router;
