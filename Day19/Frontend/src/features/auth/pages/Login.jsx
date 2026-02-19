import { Link } from "react-router"
import "../styles/form.scss"
import { useState } from "react"
import axios from "axios"

const Login = () => {

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    axios.post(`http://localhost:3000/api/auth/login`, {
      username,
      password
    },{
      withCredentials:true
    })
    .then(res => {
      console.log(res.data);
    })

    setusername("")
    setpassword("")

  }

  return (
    <main>
      <div className='form-container'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => { setusername(e.target.value) }}
            value={username}
            type='text' name='username' placeholder='Enter username'
          />

          <input
            onInput={(e) => { setpassword(e.target.value) }}
            value={password}
            type='password' name='password' placeholder='Enter Password'
          />
          <button type='submit'>Login</button>
        </form>

        <p>Dont have an account ? <Link className="toggleAuthForm" to="/register">Register</Link> </p>
      </div>
    </main>
  )
}

export default Login
