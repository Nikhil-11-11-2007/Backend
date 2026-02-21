const mongoose = require("mongoose")

const followSchema = mongoose.Schema({
    follower: String,
    followee: String,
    status: {
        type: String,
        default: "active",
        enum: {
            values: ["pending", "accepted", "rejected"],
            message: "status can only be pending, accepted or rejected"
        }
    }
}, {
    timestamps: true
})

followSchema.index({ follower: 1, followee: 1 }, { unique: true })

const followModel = mongoose.model("follows", followSchema)

module.exports = followModel