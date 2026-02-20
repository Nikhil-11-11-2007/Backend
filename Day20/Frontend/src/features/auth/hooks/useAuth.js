import { useContext } from "react";
import { AuthContext } from "../auth.contex";


export function useAuth() {
    const context = useContext(AuthContext)

    return context
}