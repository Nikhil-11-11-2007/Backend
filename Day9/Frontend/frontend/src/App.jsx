import { useEffect, useState } from 'react'
import axios from "axios"

function App() {

  const [notes, setNotes] = useState([])
  const [editNote, setEditNote] = useState(null)

  const getData = async () => {
    const res = await axios.get("http://localhost:3000/api/notes")
    return setNotes(res.data.note)
  }

  useEffect(() => {
    getData()
  }, [])

  function submitHandeler(e) {
    e.preventDefault()
    const { title, description } = e.target.elements
    axios.post("http://localhost:3000/api/notes", {
      title: title.value,
      description: description.value
    })
      .then((res) => {
        res.data
        getData()
      })

  }

  function updateHandeler(e) {
    e.preventDefault()
    const description = e.target.elements.newDescription.value
    axios.patch("http://localhost:3000/api/notes/" + editNote, { description })
      .then(() => {
        e.target.reset()
        setEditNote(null)
        getData()
      })
  }

  function deleteHandeler(noteId) {
    console.log(noteId);
    axios.delete("http://localhost:3000/api/notes/" + noteId)
      .then((res) => {
        console.log(res.data);
        getData()
      })
  }

  return (
    <>
      {/* submit handeler */}
      <form onSubmit={submitHandeler} className='note-create-form'>
        <input name='title' type="text" placeholder='Enter title' />
        <input name='description' type="text" placeholder='Enter description' />
        <button>Create note</button>
      </form>


      {editNote && (
        <form onSubmit={updateHandeler}>
          <input name='newDescription' type="text" placeholder='Write new description' />
          <button>Update</button>
        </form>
      )}

      <div className="notes">
        {
          notes.map((el, idx) => {
            return <div key={idx} className="note">
              <h1>{el.title}</h1>
              <p>{el.description}</p>
              <button onClick={() => setEditNote(el._id)}>edit</button>
              <button onClick={() => deleteHandeler(el._id)}> Delete</button>
            </div>
          })
        }
      </div>
    </>
  )
}

export default App
