const router = require("express").Router();
const {register, login, logout, getAllUsers, getCurrentUser, deleteUser, editUserImg, editUserBio} = require("../controllers/users.controller");
const { auth, authUser } = require("../middlewares/auth");
const multer = require("multer");
const { imgProcess } = require("../middlewares/imgProcess")

// Fonction de multer qui envoie l'image au dossier images/user et la renomme de façon a eviter les conflit de fichiers
const mimetypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
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
const upload = multer({ fileSize: 15 * 1024 * 1024, storage: storage });

router.get("/auth", auth, (req, res) => res.status(200).json({ auth: true }));

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/get/all", auth, getAllUsers);
router.get("/get/", auth, getCurrentUser);

router.delete("/delete/:id", auth, deleteUser);

router.put(
  "/edit/picture/:id",
  auth,
  upload.single("file"),
  imgProcess,
  editUserImg,
);

router.put("/edit/bio/:id", auth, editUserBio);


module.exports = router;
