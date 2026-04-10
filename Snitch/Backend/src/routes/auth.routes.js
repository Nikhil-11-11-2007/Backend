import { Router } from "express"
import { login, register } from "../controllers/auth.controller.js"
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js"

const router = Router()

router.post("/register", validateRegisterUser, register)

router.post("/login", validateLoginUser, login)

export default router