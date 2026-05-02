import { useState,useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('/api/users')
    .then(res => setUsers(res.data))
  },[])

  return (
    <div className="App">
      <h1>Test users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
