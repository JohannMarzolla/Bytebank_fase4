import { createContext, ReactNode, useContext, useEffect } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { Transacao } from "@/domain/models/Transacao";
import { TransacaoAdicionarForm } from "@/presentation/models/TransacaoAdicionarForm";
import { useGraficos } from "./GraficosContext";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { SaldoRepositoryFirestore } from "@/infrastructure/repositories/SaldoRepository";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { TransacaoService } from "@/application/services/TransacaoService";
import { useSaldo } from "./SaldoContext";
import { SaldoService } from "@/application/services/SaldoService";

interface TransacoesContextData {
  saldo: number;
  novaTransacao: (transacao: TransacaoAdicionarForm) => Promise<void>;
  update: (transacao: Transacao) => Promise<void>;
  remove: (transacao: Transacao) => Promise<void>;
}

const TransacoesContext = createContext<TransacoesContextData | undefined>(
  undefined
);

export const TransacoesProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const { calcularValue } = useGraficos();

  const { saldo, atualizarSaldo } = useSaldo();
  const trasacaoService = new TransacaoService(
    new TransacaoRepository(),
    new SaldoService(new SaldoRepositoryFirestore())
  );

  useEffect(() => {
    const resetAndFetch = async () => {
      await atualizarSaldo();
    };

    if (userId) {
      resetAndFetch();
    }
  }, [userId]);

  const novaTransacao = async (transacao: TransacaoAdicionarForm) => {
    try {
      await trasacaoService.insert(userId, transacao);
      // await carregarMaisTransacoes(true);
      await atualizarSaldo();
      calcularValue();
      ShowToast("success", "Transação adicionada com sucesso.");
    } catch (error: any) {
      ShowToast("error", error.message);
      console.log("error ", error);
    }
  };

  const update = async (transacao: Transacao) => {
    try {
      await trasacaoService.update(transacao);
      // await carregarMaisTransacoes(true);
      await atualizarSaldo();
      calcularValue();
      ShowToast("success", "Transação atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar a transação:", error);
    }
  };

  const remove = async (transacao: Transacao) => {
    if (!transacao.id) {
      throw new Error("Não especificado ID da transação.");
    }

    try {
      await trasacaoService.delete(userId, transacao.id);
      // await carregarMaisTransacoes(true);
      await atualizarSaldo();
      calcularValue();
      ShowToast("success", "Transação removida com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar a transação context:", error);
    }
  };

  return (
    <TransacoesContext.Provider
      value={{
        novaTransacao,
        remove,
        update,
        saldo,
      }}
    >
      {children}
    </TransacoesContext.Provider>
  );
};

export const useTransacoes = () => {
  const context = useContext(TransacoesContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacoes deve estar dentro de TransacoesProvider"
    );
  }
  return context;
};
