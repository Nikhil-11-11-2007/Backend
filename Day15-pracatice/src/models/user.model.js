const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already exists"],
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        unique: [true, "This email already exists"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    bio: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/ezawsaqfm/user%20img.jpg?updatedAt=1770803673106"
    }
})

const userModel = mongoose.model("fakeusers", userSchema)

module.exports = userModel