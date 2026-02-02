import { useState } from 'react'
import axios from "axios"

function App() {

  const [notes, setNotes] = useState([])

  const getData = async () => {
    const res = await axios.get("http://localhost:3000/api/notes")
    return setNotes(res.data.note)
  }

  getData()

  return (
    <>
      <div className="notes">
        {
          notes.map((el, idx) => {
            return <div key={idx} className="note">
              <h1>{el.title}</h1>
              <p>{el.description}</p>
            </div>
          })
        }
      </div>
    </>
  )
}

export default App
