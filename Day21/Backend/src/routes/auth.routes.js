const express = require("express")
const { registerController, loginController, getMeController } = require("../controllers/auth.controller")
const identifyUser = require("../middlewares/auth.middleware")



const authRouter = express.Router()

// POST /api/auth/register

authRouter.post("/register", registerController)

// POST /api/auth/login

authRouter.post("/login", loginController)

// GET /api/auth/get-me

authRouter.get("/get-me", identifyUser , getMeController)

module.exports = authRouter