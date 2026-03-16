import express from 'express'
import downloadRouter from './routes/download.route.js';
import errorMiddleware from './middlewares/error.middleware.js';


const app = express()

// miiddlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api", downloadRouter)

app.get("/", (req, res) => {
    res.send("YouTube Downloader API Running")
})


app.use(errorMiddleware)

export default app