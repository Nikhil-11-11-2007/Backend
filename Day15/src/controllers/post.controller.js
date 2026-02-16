const postModel = require("../models/post.model")

const Imagekit = require("@imagekit/nodejs")

const { toFile } = require("@imagekit/nodejs")

const jwt = require("jsonwebtoken")

const client = new Imagekit({
    privateKey: process.env.IMAGEKIY_PRIVATE_KEY
})

async function createPostController(req, res) {
    console.log(req.body, req.file);

    const token = req.cookies.token

    if (!token) {
        res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    let decode = null

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message: "user not Authorize"
        })
    }

    // console.log(decode);


    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "insta-clone"
    })

    console.log(file);

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decode.id
    })

    res.status(201).json({
        message: "post created",
        post
    })

}

async function getPostController(req, res) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "UnAuthorize Access"
        })
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    console.log(decoded);


    const userId = decoded.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "post fetched",
        posts
    })

}

async function getPostDetails(req, res) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "UnAuthorize access"
        })
    }

    let decoded;

    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch(err) {
        return res.status(401).json({
            message:"Invalid Token"
        })
    }

    const userId = decoded.id
    const postId = req.params.postId

    console.log(userId, postId);

    // ye user ko find kart hai post obj mai uski Id se 
    const post = await postModel.findById(postId)
    
    if(!post) {
        return res.status(404).json({
            message: "post not found."
        })
    }

    const isValidUser = post.user.toString() === userId

    if(!isValidUser) {
        return res.status(403).json({
            message: "Forbidden content"
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}

module.exports = { createPostController, getPostController, getPostDetails }