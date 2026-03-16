import { validateYoutubeUrl } from "../utils/validate.youtubeUrl.js"
import ytdl from "@distube/ytdl-core"
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from "@ffmpeg-installer/ffmpeg"
import downloadModel from "../models/download.model.js"


ffmpeg.setFfmpegPath(ffmpegPath.path)

export async function downloadYoutubeVideo(url, res) {

    if (!validateYoutubeUrl(url)) {
        throw new Error("Invalid YouTube URL")
    }

    if (!ytdl.validateURL(url)) {
        throw new Error("invalid video")
    }


    const info = await ytdl.getInfo(url)

    console.log("formats:", info.formats.length)

    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "")

    res.header(
        "Content-Disposition",
        `attachment; filename="${title}.mp4"`
    )

    res.header("Content-Type", "video/mp4")

    const videoStream = ytdl(url, {
        quality: "highestvideo",
        requestOptions: {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
            }
        }
    })

    const audioStream = ytdl(url, {
        quality: "highestaudio",
        requestOptions: {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
            }
        }
    })

    ffmpeg()
        .input(videoStream)
        .input(audioStream)
        .format("mp4")
        .on("end", async () => {
            await downloadModel.create({
                url,
                title
            })
        })
        .on("error", (err) => {
            console.log("FFmpeg error:", err)
            res.status(500).send("Error processing video")
        })
        .pipe(res)
}


// not installed packeges ytdl 2. ffmpeg 3. ffmpegPath