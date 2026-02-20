import AppRoutes from "./AppRoutes"
import { AuthProvider } from "./features/auth/auth.contex"
import "./style.scss"

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
