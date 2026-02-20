import { Link, useNavigate } from "react-router"
import "../styles/form.scss"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"

const Login = () => {

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  const { handleLogin, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <h1>Loading...</h1>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()

    handleLogin(username, password)
      .then(res => {
        console.log(res);
        navigate("/")
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
