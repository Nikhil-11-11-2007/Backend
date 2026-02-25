import { useContext, useEffect } from "react"
import { postContext } from "../post.context"
import { createPost, getFeed, likePost, unLikePost } from "../services/post.api"


export const usePost = () => {
    const context = useContext(postContext)
    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {

        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([data.post, ...feed])
        setLoading(false)

    }

    const handleLike = async (post) => {
        const data = await likePost(post)
        await handleGetFeed()
    }

    const handleUnLike = async (post) => {
        const data = await unLikePost(post)
        await handleGetFeed()
    }

    useEffect(() => {
        handleGetFeed()
    }, [])

    return { loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }
}