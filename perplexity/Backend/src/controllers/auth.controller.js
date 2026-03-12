import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../services/mail.service.js";

// route - POST /api/auth/register
// desc - register a new user
// access - Public
// body - { username, email, password }

export async function register(req, res) {

    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "user with this email or username already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign(
        {
            email: user.email
        },
        process.env.JWT_SECRET
    )

    await sendEmail({
        to: email,
        subject: "Welcome to perplexity",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "user registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

// route - POST /api/auth/login
// desc - login user and return jwt token
// access - public
// body - { email, password }

export async function login(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if(!user){
        res.status(400).json({
            message: "invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "please verify your email before logged in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

// route - GET /api/auth/get-me
// desc - get current user loggedin details
// access - private

export async function getMe(req,res) {
    
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if(!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })

}

// route - GET /api/auth/verify-email
// desc - verify users email address
// access - public
// query - { token }


export async function verifyEmail(req, res) {

    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: "invalid token",
                success: false,
                err: "user not found"
            })
        }

        user.verified = true;

        await user.save()

        const html =
            `
            <h1>Email Verified Successfully!</h1>
            <p>Your email has been verified. You can now log in to your account.</p>
            <a href="http://localhost:3000/login">Go to Login</a>
        `

        return res.send(html)
    } catch (err) {
        return res.status(400).json({
            message: "invalid or expired token",
            success: false,
            err: err.message
        })
    }



}