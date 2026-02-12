const postModel = require("../models/post.model")

const Imagekit = require("@imagekit/nodejs")

const {toFile} = require("@imagekit/nodejs")

const client = new Imagekit({
    privateKey: process.env.IMAGEKIY_PRIVATE_KEY
})

async function createPostController(req, res) {
    console.log(req.body, req.file);

    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test"
    })

    res.send(file)

}

module.exports = { createPostController }