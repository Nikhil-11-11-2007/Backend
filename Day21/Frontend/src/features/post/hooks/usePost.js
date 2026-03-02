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

    const handleLike = async (postId) => {
        await likePost(postId)

        setFeed(prev =>
            prev.map(post =>
                post._id === postId
                    ? { ...post, isLiked: true }
                    : post
            )
        )
    }

    const handleUnLike = async (postId) => {
        await unLikePost(postId)

        setFeed(prev =>
            prev.map(post =>
                post._id === postId
                    ? { ...post, isLiked: false }
                    : post
            )
        )
    }

    useEffect(() => {
        handleGetFeed()
    }, [])

    return { loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }
}