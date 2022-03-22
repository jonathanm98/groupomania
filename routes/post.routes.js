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

router.get("/", auth.authView, postController.getAllPosts);

router.post("/create/post", auth.addContent, upload.single("file"), postController.createPost);

router.delete("/delete/post/:id", auth.authDeleteContent, postController.deletePost);

router.post("/create/comment", auth.addContent, postController.createComment);

router.delete("/delete/comment/:id", auth.authDeleteContent, postController.deleteComment);

module.exports = router;
