
const express = require("express");
const postRouter = express.Router()
const { createPostController, getPostController, getPostDetails } = require("../controllers/post.controller");
const multer = require("multer");
const identifyUser = require("../middlewares/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() })

postRouter.post("/", upload.single("image"), identifyUser, createPostController)

postRouter.get("/", identifyUser , getPostController)

postRouter.get("/details/:postId", identifyUser , getPostDetails)

module.exports = postRouter