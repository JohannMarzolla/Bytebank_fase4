import {
  deleteTransacao,
  getTransacoes,
  postTransacao,
  putTransacao,
} from "@/services/TransacoesServices";
import { getSaldo, postSaldo } from "@/services/SaldoServices";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { TipoTransacao } from "@/app/types/TipoTransacao";
import { Transacao } from "@/models/Transacao";
import { TransacaoAdicionar } from "@/models/TransacaoAdicionar";

interface TransacoesContextData {
  transacoes: Transacao[];
  saldo: number;
  deposito: (number: number) => Promise<void>;
  transferencia: (number: number) => Promise<void>;
  novaTransacao: (transacao: TransacaoAdicionar) => Promise<void>;
  atualizarTransacao: (transacao : Transacao) => Promise<void>;
  deletarTransacao: (transacao: Transacao) => Promise<void>;
}

const TransacoesContext = createContext<TransacoesContextData | undefined>(
  undefined
);

export const TransacoesProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const [transacoes, setTransacoes] = useState<any>([]);
  const [saldo, setSaldo] = useState<number>(0);

  useEffect(() => {
    atualizarSaldo();
    atualizaTransacoes();
  }, [userId]);

  const atualizarSaldo = async () => {
    try {
      if (!userId) return;
      const saldoAtualizado = await getSaldo(userId);
      setSaldo(saldoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error);
    }
  };

  const atualizaTransacoes = async () => {
    try {
      if (!userId) return;
      const transacoesAtualizadas = await getTransacoes(userId);
      setTransacoes(transacoesAtualizadas);
    } catch (error) {
      console.log("Erro ao atualizar as transações", error);
    }
  };

  const deposito = async (valor: number) => {
    try {
      if (!userId) throw new Error("Usuário não autenticado.");
      const novoSaldo = saldo + valor;
      await postSaldo(userId, novoSaldo);
      await atualizarSaldo();
    } catch (error) {
      console.error("Erro ao realizar depósito:", error);
    }
  };

  const transferencia = async (valor: number) => {
    try {
      if (!userId) throw new Error("Usuário não autenticado.");
      const novoSaldo = saldo - valor;
      await postSaldo(userId, novoSaldo);
      await atualizarSaldo();
    } catch (error) {
      console.error("Erro ao realizar transferência:", error);
    }
  };

  const novaTransacao = async (transacao: TransacaoAdicionar) => {
    if (
      transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA &&
      !verificaSaldo(transacao.valor)
    ) {
      throw new Error("Saldo insuficiente para realizar a transferência.");
    }

    const newId = await postTransacao(userId, transacao);
    if (newId) {
      await atualizaTransacoes();

      switch (transacao.tipoTransacao) {
        case TipoTransacao.DEPOSITO:
          await deposito(transacao.valor);
          break;
        case TipoTransacao.TRANSFERENCIA:
          await transferencia(transacao.valor);
          break;
      }
    }
  };

  const verificaSaldo = (valor: number): boolean => {
    if (valor > saldo) {
      return false;
    }
    return true;
  };

  const atualizarTransacao = async (transacao:Transacao) => {
    if(!verificaSaldo(transacao.valor)) return

    try {
      if (!userId) throw new Error("Usuário não autenticado.");
    
      const atualizar  = await putTransacao(userId, transacao.id,transacao);
      if (atualizar){
        await atualizaTransacoes();
        await atualizarSaldo();
      }
     
    } catch (error) {
      console.error("Erro ao atualizar a transação:", error);
    }
  };

  const deletarTransacao = async (transacao: Transacao) => {
    if (!transacao.id) {
      throw new Error("Não especificado ID da transação.");
    }
    try {
      transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA
        ? await deposito(transacao.valor)
        : await transferencia(transacao.valor);

      await deleteTransacao(userId, transacao.id);
      await atualizaTransacoes();
    } catch (error) {
      console.error("Erro ao deletar a transação context:", error);
    }
  };

  return (
    <TransacoesContext.Provider
      value={{
        deposito,
        transferencia,
        novaTransacao,
        deletarTransacao,
        atualizarTransacao,
        saldo,
        transacoes,
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
