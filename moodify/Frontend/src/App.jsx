import FaceExpression from './features/Expression/components/FaceExpression'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'

import "./features/shared/styles/global.scss"
import { AuthProvider } from './features/auth/auth.context'
import { SongContextProvider } from './features/home/song.context'

function App() {

  return (
    // <main>
      <AuthProvider>
        <SongContextProvider>
          <RouterProvider router={router} />
        </SongContextProvider>
      </AuthProvider>
    // </main>
  )
}

export default App
