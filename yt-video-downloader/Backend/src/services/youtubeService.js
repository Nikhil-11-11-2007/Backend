import { validateYoutubeUrl } from "../utils/validate.youtubeUrl.js";
import ytdl from "ytdl-core"; // use latest ytdl-core
import downloadModel from "../models/download.model.js";

export async function downloadYoutubeVideo(url, res) {

    // Validate URL
    if (!validateYoutubeUrl(url)) {
        return res.status(400).send("Invalid YouTube URL");
    }

    if (!ytdl.validateURL(url)) {
        return res.status(400).send("Invalid video");
    }

    try {
        // Get video info with proper headers to avoid 403
        const info = await ytdl.getInfo(url, {
            requestOptions: {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://www.youtube.com/"
                }
            }
        });

        const title = info.videoDetails.title
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "_");

        console.log("Downloading:", title);

        // Set response headers for download
        res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        // Use single combined mp4 stream (video + audio)
        const stream = ytdl(url, {
            quality: "highest",
            filter: format => format.container === "mp4" && format.hasVideo && format.hasAudio,
            requestOptions: {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Referer": "https://www.youtube.com/"
                }
            }
        });

        // Pipe stream to response
        stream.pipe(res);

        stream.on("end", async () => {
            console.log("Download finished:", title);
            await downloadModel.create({ url, title });
        });

        stream.on("error", (err) => {
            console.error("Stream error:", err);
            if (!res.headersSent) res.status(500).send("Error downloading video");
        });

    } catch (err) {
        console.error("Download service error:", err);
        if (!res.headersSent) res.status(500).send(err.message);
    }
}