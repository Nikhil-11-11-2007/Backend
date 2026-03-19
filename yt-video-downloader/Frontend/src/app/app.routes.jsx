import { createBrowserRouter } from "react-router"
import Downloader from "../features/home/components/Downloader"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Downloader />
    }
])