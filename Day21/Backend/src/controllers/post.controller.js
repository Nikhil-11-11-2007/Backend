const postModel = require("../models/post.model")
const likeModel = require("../models/like.model")

const Imagekit = require("@imagekit/nodejs/index.js")

const { toFile } = require("@imagekit/nodejs/index.js")

const client = new Imagekit({
    privateKey: process.env.IMAGEKIY_PRIVATE_KEY
})

async function createPostController(req, res) {

    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "insta-clone"
    })

    console.log(file);

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "post created",
        post
    })

}

async function getPostController(req, res) {

    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "post fetched",
        posts
    })

}

async function getPostDetails(req, res) {

    const userId = req.user.id
    const postId = req.params.postId

    console.log(userId, postId);

    // ye user ko find kart hai post obj mai uski Id se 
    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "post not found."
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden content"
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}

async function likePostController(req, res) {
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "post liked successfully",
        like
    })
}

module.exports = { createPostController, getPostController, getPostDetails, likePostController }