import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

async function sendTokenResponse(user,res) {

    const token = jwt.sing({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

}

export const register = async (req, res) => {
    const { email, contact, password, fullname } = req.body

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "Email or contact already exists"
            })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname
        })



    } catch (error) {
        console.error("Error during registration:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}