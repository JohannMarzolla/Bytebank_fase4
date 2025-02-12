import { ShowToast } from "@/components/ui/Toast";
import { auth, db } from "../../firebase/config";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useState } from "react";
import { FirebaseError } from "firebase/app";

interface IAuthContext {
  user: UserCredential | null;
  userId: string;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserCredential | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<any>();

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
    try {
      const cadastro = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = cadastro.user.uid;
      setUserId(userId);

      await setDoc(doc(db, "users", userId), { email, saldo: 0 })
        .then(() => {
          ShowToast(
            "success",
            "Conta cadastrada com sucesso.",
            "Efetue o login para acessar a conta."
          );
          router.replace("/login");
        })
        .catch((err) => {
          ShowToast("error", "Erro ao cadastrar a conta.", err);
        });
    } catch (error) {
      const detail = (error as FirebaseError)?.message;
      ShowToast("error", "Erro ao cadastrar a conta.", detail);
    }
  };

  const logout = () => {
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
