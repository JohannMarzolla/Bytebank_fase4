import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { SaldoService } from "@/application/services/SaldoService";
import { SaldoRepositoryFirestore } from "@/infrastructure/repositories/SaldoRepository";
import { ShowToast } from "@/presentation/components/ui/Toast";

interface SaldoContextData {
  saldo: number;
  atualizarSaldo: () => Promise<void>;
}

const SaldoContext = createContext<SaldoContextData | undefined>(undefined);

export const SaldoProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const [saldo, setSaldo] = useState<number>(0);

  const saldoService = new SaldoService(new SaldoRepositoryFirestore());

  const atualizarSaldo = async () => {
    if (!userId) return;
    try {
      const novoSaldo = await saldoService.get(userId);
   
      setSaldo(novoSaldo ?? 0);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
      ShowToast("error", "Erro ao buscar saldo");
    }
  };

  useEffect(() => {
    atualizarSaldo();
  }, [userId]);

  return (
    <SaldoContext.Provider
      value={{
        saldo,
        atualizarSaldo,
       
      }}
    >
      {children}
    </SaldoContext.Provider>
  );
};

export const useSaldo = (): SaldoContextData => {
  const context = useContext(SaldoContext);
  if (!context) {
    throw new Error("useSaldo deve ser usado dentro de SaldoProvider");
  }
  return context;
};
