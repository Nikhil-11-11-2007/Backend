import { downloadYoutubeVideo } from "../services/youtubeService.js"


export async function downloadVideo(req,res,next) {
    try{
        const {url} = req.query

        if(!url) {
            const err = new Error("URL is required")
            err.status = 400
            throw err
        }

        await downloadYoutubeVideo(url,res)
    } catch (err) {
        err.status = err.status || 500
        next(err)
    }
}