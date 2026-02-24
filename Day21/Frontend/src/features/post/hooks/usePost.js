import { useContext } from "react"
import { postContext } from "../post.context"
import { getFeed } from "../services/post.api"


export const usePost = () => {
    const context = useContext(postContext)
    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    return { loading, feed, post, handleGetFeed }
}