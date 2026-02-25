import { useEffect } from "react"
import Post from "../components/Post"
import { usePost } from "../hooks/usePost"
import "../style/feed.scss"
import Nav from "../../shared/components/Nav"

const Feed = () => {

    const { handleGetFeed, feed, loading, handleLike, handleUnLike } = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [])

    if (loading || !feed) {
        return (
            <main>
                <h1>Feed is Loading...</h1>
            </main>
        )
    }

    console.log(feed)
    
    return (
        <main className="feed-page">
            <Nav /> 
            <div className="feed">
                <div className="posts">
                    {feed.map((post) => {
                        return <Post key={post._id} user={post.user} post={post} loading={loading} handleLike={handleLike} handleUnLike={handleUnLike} />
                    })}
                </div>
            </div>
        </main>
    )
}

export default Feed