import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { SaldoService } from "@/application/services/SaldoService";
import { SaldoRepositoryFirestore } from "@/infrastructure/repositories/SaldoRepository";
import { ShowToast } from "@/presentation/components/ui/Toast";

interface SaldoContextData {
  saldo: number;
  atualizarSaldo: () => Promise<void>;
  deposito: (valor: number) => Promise<void>;
  transferencia: (valor: number) => Promise<void>;
}

const SaldoContext = createContext<SaldoContextData | undefined>(undefined);

export const SaldoProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const [saldo, setSaldo] = useState<number>(0);

  const saldoService = SaldoService(new SaldoRepositoryFirestore());

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

  const deposito = async (valor: number) => {
    if (!userId) throw new Error("Usuário não autenticado.");
    try {
      const updated = saldo + valor;
      await saldoService.update(userId, updated);
      await atualizarSaldo();
      ShowToast("success", "Depósito realizado com sucesso");
    } catch (error: any) {
      console.error("Erro no depósito:", error);
      ShowToast("error", error.message || "Erro no depósito");
    }
  };

  const transferencia = async (valor: number) => {
    if (!userId) throw new Error("Usuário não autenticado.");
    try {
      const updated = saldo - valor;
      await saldoService.update(userId, updated);
      await atualizarSaldo();
      ShowToast("success", "Transferência realizada com sucesso");
    } catch (error: any) {
      console.error("Erro na transferência:", error);
      ShowToast("error", error.message || "Erro na transferência");
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
        deposito,
        transferencia,
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
