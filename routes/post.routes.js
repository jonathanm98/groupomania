const router = require("express").Router();
const postController = require("../controllers/post.controller");
const {auth, authDeleteContent} = require("../middlewares/auth");
const multer = require("multer");
const { imgProcess } = require("../middlewares/imgProcess")

// Fonction de multer qui agit sur les fichiers du disque pour renomer nos images et les placer dans le bon dossier
const mimetypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
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
const upload = multer({ fileSize: 15 * 1024 * 1024, storage: storage });

router.get("/:index/", auth, postController.incPosts);
router.get("/refresh/:count", auth, postController.refreshPosts);

router.post(
  "/create/post",
    auth,
  upload.single("file"),
  imgProcess,
  postController.createPost,
);
router.delete(
  "/delete/post/:id",
  authDeleteContent,
  postController.deletePost
);

router.post("/create/comment", auth, postController.createComment);
router.delete(
  "/delete/comment/:id",
  authDeleteContent,
  postController.deleteComment
);

router.post("/like/:id", auth, postController.like);
router.post("/dislike/:id", auth, postController.like);

module.exports = router;
