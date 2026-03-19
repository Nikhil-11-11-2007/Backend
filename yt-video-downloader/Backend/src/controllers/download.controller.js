
export async function downloadYoutubeVideo(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL required" });
    }

    // 👉 direct redirect to downloader site
    const redirectUrl = `https://www.ytmp3.nu/ytmp3/?url=${url}`;

    return res.json({ downloadUrl: redirectUrl });
}