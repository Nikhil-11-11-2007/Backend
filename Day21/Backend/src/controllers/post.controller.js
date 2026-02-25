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

    if (!post) {
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

async function unLikePostController(req, res) {
    const posId = req.params.postId
    const username = req.user.username

    const isLiked = await likeModel.findOne({
        post: posId,
        user: username
    })

    if(!isLiked) {
        return res.status(400).json({
            message: "post Didn't like"
        })
    }

    await likeModel.findByIdAndDelete({_id: isLiked._id})

    return res.status(200).json({
        message: "post unliked usccessfully"
    })
}

async function getFeedController(req, res) {

    const user = req.user

    const posts = await Promise.all((await postModel.find().populate("user").sort({ _id: -1 }).lean())
        .map(async (post) => {

            // type of post mongooseObj
            // so we coudnot directly add new propery jaise isLiked iske liye lean ko use krte hai

            const isLiked = await likeModel.findOne({
                user: user.username,
                post: post._id
            })

            post.isLiked = Boolean(isLiked)

            return post
        }))

    res.status(200).json({
        message: "Post fetched successfully",
        posts
    })
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetails,
    likePostController,
    getFeedController,
    unLikePostController
}