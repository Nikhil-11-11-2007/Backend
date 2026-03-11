import cookieParser from 'cookie-parser';
import express from 'express'
import authRouter from './routes/auth.routes.js';


const app = express()

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter)


export default app;