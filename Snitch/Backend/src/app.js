import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js'
import productRouter from './routes/product.routes.js'
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import passport from 'passport'
import { config } from './config/config.js'


const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/api/auth/google/callback"
},(accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}))


app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)


export default app