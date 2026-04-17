import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useSelector } from "react-redux"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react"

const App = () => {

  const user = useSelector(state => state.auth.user)
  const {handleGetMe} = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  console.log(user);
  

  return (
    <RouterProvider router={routes} />
  )
}

export default App