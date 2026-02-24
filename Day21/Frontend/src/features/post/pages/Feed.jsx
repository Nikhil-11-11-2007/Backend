import { useEffect } from "react"
import Post from "../components/Post"
import { usePost } from "../hooks/usePost"
import "../style/feed.scss"

const Feed = () => {

    const { handleGetFeed, feed, loading } = usePost()

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
            <div className="feed">
                <div className="posts">
                    {feed.map((post,idx) => {
                        return <Post key={idx} user={post.user} post={post} />
                    })}
                </div>
            </div>
        </main>
    )
}

export default Feed