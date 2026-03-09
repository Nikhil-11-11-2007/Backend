const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const redis = require("../config/cache")

async function registerUser(req, res, next) {

    const { username, email, password } = req.body

    const isUserAlreadyRegistered = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })
    
    try{
        if(isUserAlreadyRegistered){
            throw new Error("User with the same email or username already exists")
        }
    } catch (err) {
        err.status = 400
        next(err)
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
    })

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

async function loginUser(req, res) {

    const { email, password, username } = req.body

    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "invalid credentials",
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        return res.status(400).json({
            message: "invalid credentials"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "3d"
        }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "Loggined successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })

}

async function getUser(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "user fetched successfully",
        user
    })
}

async function logoutUser(req,res) {

    const token = req.cookies.token

    res.clearCookie("token")

    // await blacklistModel.create({
    //     token
    // })

    redis.set(token, Date.now().toString(), "EX", 60*60)

    res.status(200).json({
        message: " logout successfully"
    })
}

module.exports = { registerUser, loginUser, getUser, logoutUser }