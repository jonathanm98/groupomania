const router = require("express").Router();
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth");
const multer = require("multer");

// Fonction de multer qui envoie l'image au dossier front et la renomme de façon a eviter les conflit de fichiers
const mimetypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/post");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[^a-zA-Z]/g, "");
    const ext = mimetypes[file.mimetype];
    callback(null, name + Date.now() + "." + ext);
  },
});
const upload = multer({ fileSize: 2097152, storage: storage });

router.get("/", auth.noEdit, postController.getAllPosts);
router.get("/:id", auth.noEdit, postController.getOnePost);

router.post(
  "/",
  auth.noEdit,
  upload.single("file"),
  postController.createPost
);

module.exports = router;
