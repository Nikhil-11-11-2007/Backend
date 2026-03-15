import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import { getME, login, register } from "../services/auth.api";


export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registaion failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getME()
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch user"))
        } finally {
            dispatch(setLoading(false))
        }
    }


    return {
        handleRegister, handleLogin, handleGetMe
    }
}