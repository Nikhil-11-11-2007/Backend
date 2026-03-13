import { Router } from 'express'
import { loginValidator, registerValidator } from '../validators/auth.validator.js';
import { getMe, login, register, resendVerification, verifyEmail } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRouter = Router()

// route - POST /api/auth/register
// desc - register a new user
// access - Public
// body - { username, email, password }
authRouter.post("/register", registerValidator, register)


// route - POST /api/auth/login
// desc - login user and return jwt token
// access - public
// body - { email, password }
authRouter.post("/login", loginValidator, login)


// route - GET /api/auth/get-me
// desc - get current user loggedin details
// access - private
authRouter.get("/get-me", authMiddleware, getMe)


// route - GET /api/auth/verify-email
// desc - verify users email address
// access - public
// query - { token }
authRouter.get("/verify-email", verifyEmail)

// route - POST /api/auth/resend-verification
// desc - resend verification email
// access - public
// body - { email }

authRouter.post("/resend-verification", resendVerification)

export default authRouter;