
const express = require("express");
const postRouter = express.Router()
const { createPostController, getPostController, getPostDetails, likePostController } = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() })

postRouter.post("/", upload.single("image"), identifyUser, createPostController)

postRouter.get("/", identifyUser , getPostController)

postRouter.get("/details/:postId", identifyUser , getPostDetails)

// post /api/post/like/:postId
// like a post with the id provided in params

postRouter.post("/like/:postId", identifyUser, likePostController)

module.exports = postRouter