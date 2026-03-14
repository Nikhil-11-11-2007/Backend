import express from "express"
import { downloadVideo } from "../controllers/download.controller.js";

const downloadRouter = express.Router()

downloadRouter.get("/download", downloadVideo)

export default downloadRouter;