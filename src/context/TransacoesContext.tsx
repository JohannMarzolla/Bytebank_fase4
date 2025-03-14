import {
  deleteTransacao,
  getTransacoes,
  getTransacoesLimitId,
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
import { Transacao } from "@/models/Transacao";
import { TransacaoAdicionar } from "@/models/TransacaoAdicionar";
import { TipoTransacao } from "@/app/types/TipoTransacao";
import { useGraficos } from "./GraficosContext";
import { ShowToast } from "@/components/ui/Toast";

interface TransacoesContextData {
  saldo: number;
  transacoes: Transacao[];
  deposito: (number: number) => Promise<void>;
  transferencia: (number: number) => Promise<void>;
  novaTransacao: (transacao: TransacaoAdicionar) => Promise<void>;
  atualizarTransacao: (transacao: Transacao) => Promise<void>;
  deletarTransacao: (transacao: Transacao) => Promise<void>;
  transacoesLista: Transacao[];
  carregarMaisTransacoes: any;
  loading: boolean;
  tipoFiltro: string;
  setTipoFiltro: (filtro: "Todos" | "deposito" | "transferencia") => void;
  setTransacoesLista: any ;
  setLastDoc: any;
  setHasMoreData :any;
}

const TransacoesContext = createContext<TransacoesContextData | undefined>(
  undefined
);

export const TransacoesProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const { calcularValue, filtroData } = useGraficos();
  const [saldo, setSaldo] = useState<number>(0);
  const [transacoes, setTransacoes] = useState<any>([]);
  const [transacoesLista, setTransacoesLista] = useState<Transacao[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState<"Todos" | "deposito" | "transferencia">("Todos");

  useEffect(() => {
    const resetAndFetch = async () => {
   
      setTransacoesLista([]);
      setLastDoc(null);
      setHasMoreData(true);
      
      await atualizarSaldo();
      await carregarMaisTransacoes(true); 
    };
  
    if (userId) {
      resetAndFetch();
    }
  }, [userId, tipoFiltro]); 

  const carregarMaisTransacoes = async (reset = false) => {
    if (!userId || loading || (!reset && !hasMoreData)) return;
  
    try {
      setLoading(true);
  
      if (reset) {
        setTransacoesLista([]);
        setLastDoc(null);
        setHasMoreData(true);
      }
  
      const { transacoes: novasTransacoes, lastVisible } = await getTransacoesLimitId(
        userId,
        4,
        reset ? null : lastDoc,
        tipoFiltro
      );
  
      setTransacoesLista(prev => {
        // Remove a filtragem por IDs existentes quando reset=true
        return reset ? novasTransacoes : [...prev, ...novasTransacoes];
      });
  
      setLastDoc(lastVisible);
      setHasMoreData(novasTransacoes.length === 4);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };
  const atualizarSaldo = async () => {
    try {
      if (!userId) return;
      const saldoAtualizado = await getSaldo(userId);
      setSaldo(saldoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error);
    }
  };
  const atualizaTransacoesLista = async () => {
    try {
      if (!userId) return;
      
      setLoading(true);
      setLastDoc(null);
      setHasMoreData(true);  
  
      const { transacoes: transacoesAtualizadas, lastVisible } = await getTransacoesLimitId(userId, 4, null, tipoFiltro);
      
      setTransacoesLista(transacoesAtualizadas); 
      setLastDoc(lastVisible);
      
      if (!lastVisible || transacoesAtualizadas.length < 4) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar as transações", error);
    } finally {
      setLoading(false);
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
  
    try {
      await postTransacao(userId, transacao);
      await carregarMaisTransacoes(true);
      await atualizarSaldo();
      atualizarGrafico(transacao.date);
      
      switch (transacao.tipoTransacao) {
        case TipoTransacao.DEPOSITO:
          await deposito(transacao.valor);
          break;
        case TipoTransacao.TRANSFERENCIA:
          await transferencia(transacao.valor);
          break;
      }
    } catch (error: any) {
      ShowToast("error", error.message);
    }
  };

  const atualizarGrafico = (date: Date) => {
    if (
      date.getMonth() === filtroData.mes &&
      date.getFullYear() === filtroData.ano
    ) {
      calcularValue();
    }
  };

  const verificaSaldo = (valor: number): boolean => {
    if (valor > saldo) {
      return false;
    }
    return true;
  };

  const atualizarTransacao = async (transacao: Transacao) => {
    try {
      await putTransacao(userId, transacao.id, transacao);
     
      await carregarMaisTransacoes(true); 
      await atualizarSaldo();
      atualizarGrafico(transacao.date);
    } catch (error) {
      console.error("Erro ao atualizar a transação:", error);
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

  const deletarTransacao = async (transacao: Transacao) => {
    if (!transacao.id) {
      throw new Error("Não especificado ID da transação.");
    }
    try {
      transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA
        ? await deposito(transacao.valor)
        : await transferencia(transacao.valor);

      await deleteTransacao(userId, transacao.id);
      await carregarMaisTransacoes(true)
      await atualizaTransacoes()
      atualizarGrafico(transacao.date);
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
        transacoesLista,
        carregarMaisTransacoes,
        loading,
        tipoFiltro,
        setTipoFiltro,
        setTransacoesLista,
        setHasMoreData,
        setLastDoc,
        transacoes
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
