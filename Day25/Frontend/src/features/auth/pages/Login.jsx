import { Link, useNavigate } from "react-router"
import FormGroup from "../components/FormGroup"
import "../style/login.scss"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"

const Login = () => {

    const { loading, handleLogin } = useAuth()

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate("/")
    }
    
    if (loading) {
        return (
            <main><h1>Loading...</h1></main>
        )
    }

    return (
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email" placeholder="Enter your email"
                    />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password" placeholder="Enter your password"
                    />
                    <button className="button" type='submit'>Login</button>
                </form>
                <p>Don't have an account <Link to="/register">Register Here</Link> </p>
            </div>
        </main>
    )
}

export default Login