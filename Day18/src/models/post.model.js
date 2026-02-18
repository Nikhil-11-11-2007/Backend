const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        required:[true, "image url required for creating a post"]
    },
    user:{
        ref:"users",
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "userId required for creating an post"]
    }
})

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel