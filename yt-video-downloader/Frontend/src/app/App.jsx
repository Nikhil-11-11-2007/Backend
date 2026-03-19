import { RouterProvider } from "react-router"
import { DownloadProvider } from "../features/home/download.context"
import "../features/shared/global.scss"
import { router } from "./app.routes"

const App = () => {
  return (
    <DownloadProvider>
      <RouterProvider router={router} />
    </DownloadProvider>
  )
}

export default App