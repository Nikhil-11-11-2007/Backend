const { Router } = require("express")
const { registerUser, loginUser, getUser, logoutUser } = require("../controllers/auth.controller")
const authUser = require("../middlewares/auth.middleware")
const { registerValidation, loginValidation } = require("../validators/auth.validator")
const validate = require("../middlewares/validate.middleware")

const router = Router()

router.post("/register", registerValidation, validate, registerUser)

router.post("/login", loginValidation, validate, loginUser)

router.get("/get-me", authUser, getUser)

router.get("/logout", authUser, logoutUser)

module.exports = router