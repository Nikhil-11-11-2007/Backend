const mongoose = require("mongoose")

const followSchema = mongoose.Schema({
    follow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "fowllower is required"]
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "followee is required"]
    }
},{
    timestamps: true
})

const followModel = mongoose.model("follows", followSchema)

module.exports = followModel