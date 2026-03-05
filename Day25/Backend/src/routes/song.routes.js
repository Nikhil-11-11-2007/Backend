const express = require("express")
const { uploadSong, getSong } = require("../controllers/song.controller")
const upload = require("../middlewares/upload.middleware")

const router = express.Router()


// POST /api/songs/

router.post("/", upload.single("song"), uploadSong)

router.get("/", getSong)

module.exports = router