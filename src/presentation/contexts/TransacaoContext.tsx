import { createContext, ReactNode, useContext, useRef } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { Transacao } from "@/domain/models/Transacao";
import { TransacaoAdicionarForm } from "@/presentation/models/TransacaoAdicionarForm";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { useTransacaoService } from "@/application/hooks/useTransacaoService";

export type TransacaoListener = () => void;

interface TransacaoContextData {
  novaTransacao: (transacao: TransacaoAdicionarForm) => Promise<void>;
  update: (transacao: Transacao) => Promise<void>;
  remove: (transacaoId: string) => Promise<void>;
  onChangeAddListener: (listener: TransacaoListener) => void;
  onChangeRemoveListener: (listener: TransacaoListener) => void;
}

const TransacaoContext = createContext<TransacaoContextData | undefined>(
  undefined
);

export const TransacaoProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const listeners = useRef<Set<TransacaoListener>>(new Set());
  const transacaoService = useTransacaoService();

  const novaTransacao = async (transacao: TransacaoAdicionarForm) => {
    try {
      await transacaoService.insert(userId, transacao);
      notificarListeners();
      ShowToast("success", "Transação adicionada com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao adicionar a transação.");
      }
    }
  };

  const update = async (transacao: Transacao) => {
    try {
      await transacaoService.update(transacao);
      notificarListeners();
      ShowToast("success", "Transação atualizada com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao atualizar a transação.");
      }
    }
  };

  const remove = async (transacaoId: string) => {
    try {
      await transacaoService.delete(userId, transacaoId);
      notificarListeners();
      ShowToast("success", "Transação removida com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao remover a transação.");
      }
    }
  };

  const notificarListeners = () => {
    listeners.current.forEach((listener) => listener());
  };

  const onChangeAddListener = (listener: TransacaoListener) => {
    listeners.current.add(listener);
  };

  const onChangeRemoveListener = (listener: TransacaoListener) => {
    listeners.current.delete(listener);
  };

  return (
    <TransacaoContext.Provider
      value={{
        novaTransacao,
        remove,
        update,
        onChangeAddListener,
        onChangeRemoveListener,
      }}
    >
      {children}
    </TransacaoContext.Provider>
  );
};

export const useTransacaoContext = () => {
  const context = useContext(TransacaoContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacao deve estar dentro de TransacaoProvider"
    );
  }
  return context;
};
