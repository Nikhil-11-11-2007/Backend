const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth", authRoutes)

// https://drive.google.com/drive/folders/163GI6skYo0O-JJibT_dXmcUrgsHwMDqk

module.exports = app