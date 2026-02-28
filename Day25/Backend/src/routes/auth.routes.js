const { Router } = require("express")
const { registerUser, loginUser, getUser, logoutUser } = require("../controllers/auth.controller")
const authUser = require("../middlewares/auth.middleware")

const router = Router()

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/get-me", authUser ,getUser)

router.get("/logout", logoutUser)

module.exports = router