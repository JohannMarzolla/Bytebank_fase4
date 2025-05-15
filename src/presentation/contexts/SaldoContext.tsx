import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { useTransacaoContext } from "./TransacaoContext";
import { useSaldoService } from "@/application/hooks/useSaldoService";

interface SaldoContextData {
  saldo: number;
  atualizarSaldo: () => Promise<void>;
}

const SaldoContext = createContext<SaldoContextData | undefined>(undefined);

export const SaldoProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const { onChangeAddListener, onChangeRemoveListener } = useTransacaoContext();
  const [saldo, setSaldo] = useState<number>(0);
  const saldoService = useSaldoService();

  const atualizarSaldo = async () => {
    if (!userId) return;
    try {
      const novoSaldo = await saldoService.get(userId);
      setSaldo(novoSaldo ?? 0);
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao buscar saldo");
      }
    }
  };

  useEffect(() => {
    if (!userId) return;

    atualizarSaldo();

    const handleTransacoesMudaram = () => {
      atualizarSaldo();
    };

    onChangeAddListener(handleTransacoesMudaram);
    return () => {
      onChangeRemoveListener(handleTransacoesMudaram);
    };
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

export const useSaldoContext = (): SaldoContextData => {
  const context = useContext(SaldoContext);
  if (!context) {
    throw new Error("useSaldoContext deve ser usado dentro de SaldoProvider");
  }
  return context;
};
