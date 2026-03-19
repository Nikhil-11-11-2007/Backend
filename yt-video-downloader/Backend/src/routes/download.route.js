import express from "express";
import { downloadYoutubeVideo } from "../controllers/download.controller.js";

const router = express.Router();

router.post("/download", downloadYoutubeVideo);

export default router;