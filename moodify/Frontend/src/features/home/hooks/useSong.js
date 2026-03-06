import { useContext } from "react"
import { SongContext } from "../song.context"
import { getSong } from "../service/song.api"


export const useSong = () => {

    const context = useContext(SongContext)

    const { song, setSong, loading, setLoading } = context

    async function handleGetSong({ mood }) {
        setLoading(true)
        const data = await getSong({ mood })
        setSong(data.song)
        setLoading(false)
    }

    return (
        { song, loading, handleGetSong }
    )

}