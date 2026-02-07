const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const isEmailAlreadyExists = await userModel.findOne({ email })

    if (isEmailAlreadyExists) {
        return res.status(409).json({
            message: "With this email account already exists"
        })
    }

    const user = await userModel.create({
        name, email, password
    })

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("jwt_token", token)

    res.status(201).json({
        message: "user registered",
        user,
        token
    })

})

authRouter.post("/protected", (req, res) => {
    console.log(req.cookies);

    res.status(201).json({
        message: "done"
    })
})

// controller

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if(!user) {
        return res.status(404).json({
            message: "This email not exists"
        })
    }

    const isPasswordMatched = user.password === password

    if(!isPasswordMatched) {
        return res.status(401).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    )

    res.status(200).json({
        message: "Login successfully",
        user,
        token
    })


})

module.exports = authRouter