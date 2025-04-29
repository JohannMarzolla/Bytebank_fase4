import { ShowToast } from "@/presentation/components/ui/Toast";
import { router } from "expo-router";
import { User } from "firebase/auth";
import { createContext, ReactNode, useContext, useState } from "react";
import { AuthService } from "@/application/services/AuthService";

interface IAuthContext {
  user: User | null;
  userId: string;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<any>();

  const login = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        setUserId(user.uid);
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof Error) {
        ShowToast(
          "error",
          error.message || "Erro desconhecido ao fazer login."
        );
      }
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await AuthService.createUser(email, password);
      ShowToast(
        "success",
        "Conta cadastrada com sucesso.",
        "Efetue o login para acessar a conta."
      );
      router.replace("/login");
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao cadastrar a conta.");
      }
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      ShowToast("success", "Você foi desconectado.");
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message);
      }
    }
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
