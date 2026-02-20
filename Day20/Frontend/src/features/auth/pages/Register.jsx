import { Link } from "react-router"
import axios from 'axios'
import { useState } from "react"

const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    axios.post(`http://localhost:3000/api/auth/register`, {
      username,
      email,
      password
    },{
      withCredentials:true
    })
    .then(res =>{
      console.log(res.data);
    })

    setUsername("")
    setEmail("")
    setPassword("")
  }

  return (
    <main>
      <div className='form-container'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => { setUsername(e.target.value) }}
            value={username}
            type='text' name='username' placeholder='Enter username'
          />
          <input
            onInput={(e) => { setEmail(e.target.value) }}
            value={email}
            type='text' name='email' placeholder='Enter your email'
          />
          <input
            onInput={(e) => { setPassword(e.target.value) }}
            value={password}
            type='password' name='password' placeholder='Enter password'
          />
          <button>Register</button>
        </form>

        <p>Already have an account? <Link className="toggleAuthForm" to="/login">Login</Link> </p>
      </div>
    </main>
  )
}

export default Register