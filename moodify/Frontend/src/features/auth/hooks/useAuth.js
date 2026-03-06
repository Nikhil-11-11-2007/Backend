import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { getMe, login, logout, register } from "../services/auth.api"

export const useAuth = () => {
    const context = useContext(AuthContext)

    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
        try {
            setLoading(true)
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin({ username, email, password }) {
        try {
            setLoading(true)
            const data = await login({ username, email, password })
            setUser(data.user)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleGetMe() {
        try {
            setLoading(true)
            const data = await getMe()
            setUser(data.user)
        } catch (err) {
            setUser(null) 
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        try {
            setLoading(true)
            await logout()
            setUser(null)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetMe()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleGetMe, handleLogout }
}