export function validateYoutubeUrl(url){
    if(!url) return false

    return url.includes("youtube.com") || url.includes("youtu.be")
}