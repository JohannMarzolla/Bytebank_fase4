import { auth, db } from "../../firebase/config";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useState } from "react";

interface IAuthContext {
  user: UserCredential | null;
  userId : string;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserCredential | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] =  useState<any>()

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid; 
      setUser(userCredential);
      setIsAuthenticated(true);
      setUserId(userId);
      return true;
    } catch (error) {
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    const cadastro = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = cadastro.user.uid;
    setUserId(userId)

    await setDoc(doc(db, "users", userId), {
      email,
      saldo: 0,
    })
      .then(() => {
        router.replace("/login");
        console.log("AuthProvider :: signUp - usuário cadastrado com sucesso");
      })
      .catch((err) => {
        console.log("AuthProvider :: signUp - falha", err);
      });
  };

  const logout = () => {
    console.log("AuthProvider :: logout - usuário deslogado com sucesso");
    auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        login,
        signUp,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useAuth deve estar dentro de AuthProvider"
    );
  }
  return context;
};
