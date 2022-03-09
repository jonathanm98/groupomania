const router = require("express").Router();
const postController = require("../controllers/post.controller");

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getOnePost);

// router.post("/", postController.createPost)

module.exports = router;
