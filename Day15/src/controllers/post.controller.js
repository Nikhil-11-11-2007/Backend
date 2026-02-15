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

    console.log(decode);
    

    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "insta-clone"
    })

    console.log(file);
    
    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user:decode.id
    })

    res.status(201).json({
        message:"post created",
        post
    })

}

async function getPostController(req,res) {
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message: "token not provided"
        })
    }

    let decode;

    try{
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    
}

module.exports = { createPostController , getPostController }