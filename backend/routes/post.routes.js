const router = require("express").Router();
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth");
const multer = require("multer");

// Fonction de multer qui agit sur les fichiers du disque pour renomer nos images et les placer dans le bon dossier
const mimetypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
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

router.get("/:index/", auth.authUser, postController.incPosts);
router.get("/refresh/:count", auth.authUser, postController.refreshPosts);

router.post(
  "/create/post",
  auth.authUser,
  upload.single("file"),
  postController.createPost
);
router.delete(
  "/delete/post/:id",
  auth.authDeleteContent,
  postController.deletePost
);

router.post("/create/comment", auth.authUser, postController.createComment);
router.delete(
  "/delete/comment/:id",
  auth.authDeleteContent,
  postController.deleteComment
);

router.post("/like/:id", auth.authUser, postController.like);
router.post("/dislike/:id", auth.authUser, postController.like);

module.exports = router;
