import { ShowToast } from "@/presentation/components/ui/Toast";
import { createContext, ReactNode, useContext, useState } from "react";
import { AuthService } from "@/application/services/AuthService";

interface IAuthContext {
  userId: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<any>();

  const login = async (email: string, password: string) => {
    try {
      const user = await AuthService.login(email, password);
      if (user) {
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

  const logout = async () => {
    try {
      await AuthService.logout();
      setUserId(null);
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
        userId,
        login,
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
