import express from 'express'
import downloadRouter from './routes/download.route.js';


const app = express()

// miiddlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api", downloadRouter)


export default app