import { auth } from "@/firebase/config"
import { router } from "expo-router"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth"
import { createContext, ReactNode, useContext, useState } from "react"

interface IAuthContext {
    user: UserCredential | null
    login: (email: string, password: string) => Promise<boolean>
    signUp: (email: string, password: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserCredential | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            setUser(userCredential)
            setIsAuthenticated(true)
            console.log('AuthProvider :: login - usuário logado com sucesso')
            return true
        } catch (error) {
            
            console.log('AuthProvider :: login - falha ao logar usuário', error)
            return false
        }
    }

    const signUp = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                router.replace('/login')
                console.log('AuthProvider :: signUp - usuário cadastrado com sucesso')
            })
            .catch(err => {
                console.log('AuthProvider :: signUp - falha', err)
            })
    }

    const logout = () => {
        console.log('AuthProvider :: logout - usuário deslogado com sucesso')
        auth.signOut()
        setUser(null)
        setIsAuthenticated(false)
    }

    return <AuthContext.Provider value={{
        user,
        login,
        signUp,
        logout,
        isAuthenticated
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('contexto não encontado, useAuth deve estar dentro de AuthProvider')
    }
    return context
}