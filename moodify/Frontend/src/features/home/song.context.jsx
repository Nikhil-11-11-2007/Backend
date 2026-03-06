import { createContext, useState } from "react";


export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/ezawsaqfm/cohort-2/modify/songs/Khaamiyan_X8OPVUPza.mp3",
        "posterUrl": "https://ik.imagekit.io/ezawsaqfm/cohort-2/modify/posters/Khaamiyan_MDYEIBJqY.jpeg",
        "title": "Khaamiyan",
        "mood": "sad",

    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
            {children}
        </SongContext.Provider>
    )
}