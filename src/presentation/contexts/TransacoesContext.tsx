import {
  deleteTransacao,
  getTransacoesLimitId,
  postTransacao,
  putTransacao,
} from "@/domain/services/TransacoesServices";
import { getSaldo, postSaldo } from "@/domain/services/SaldoServices";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { Transacao } from "@/domain/models/Transacao";
import { TransacaoAdicionar } from "@/domain/models/TransacaoAdicionar";
import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { useGraficos } from "./GraficosContext";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { DocumentData } from "firebase/firestore";
import { SaldoService } from "@/application/services/SaldoService";
import { SaldoRepositoryFirestore } from "@/infrastructure/repositories/SaldoRepository";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { TransacaoService } from "@/application/services/TransacaoService";

interface TransacoesContextData {
  saldo: number;
  deposito: (valor: number) => Promise<void>;
  transferencia: (valor: number) => Promise<void>;
  novaTransacao: (transacao: TransacaoAdicionar) => Promise<void>;
  atualizarTransacao: (transacao: Transacao) => Promise<void>;
  deletarTransacao: (transacao: Transacao) => Promise<void>;
  transacoesLista: Transacao[];
  carregarMaisTransacoes: (reset?: boolean) => Promise<void>;
  loading: boolean;
  tipoFiltro: "Todos" | "deposito" | "transferencia";
  setTipoFiltro: Dispatch<
    SetStateAction<"Todos" | "deposito" | "transferencia">
  >;
  setTransacoesLista: Dispatch<SetStateAction<Transacao[]>>;
  setLastDoc: Dispatch<SetStateAction<DocumentData | null>>;
  setHasMoreData: Dispatch<SetStateAction<boolean>>;
  dataInicio: Date | null;
  dataFim: Date | null;
  setDataInicio: Dispatch<SetStateAction<Date | null>>;
  setDataFim: Dispatch<SetStateAction<Date | null>>;
}

const TransacoesContext = createContext<TransacoesContextData | undefined>(
  undefined
);

export const TransacoesProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const { calcularValue } = useGraficos();
  const [saldo, setSaldo] = useState<number>(0);
  const [transacoesLista, setTransacoesLista] = useState<Transacao[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState<
    "Todos" | "deposito" | "transferencia"
  >("Todos");
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const saldoService = SaldoService(new SaldoRepositoryFirestore());
  const trasacaoService = TransacaoService(new TransacaoRepository());

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
  }, [userId, tipoFiltro, dataInicio, dataFim]);

  const carregarMaisTransacoes = async (reset = false) => {
    if (!userId || loading || (!reset && !hasMoreData)) return;

    try {
      setLoading(true);

      if (reset) {
        setTransacoesLista([]);
        setLastDoc(null);
        setHasMoreData(true);
      }

      const { transacoes: novasTransacoes, lastVisible } =
        await trasacaoService.buscarTransacoesPaginadas(
          userId,
          4,
          reset ? null : lastDoc,
          tipoFiltro,
          dataInicio,
          dataFim
        );

      setTransacoesLista((prev) => {
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
      const saldoAtualizado = await saldoService.obterSaldo(userId);
      setSaldo(saldoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error);
    }
  };

  const deposito = async (valor: number) => {
    try {
      if (!userId) throw new Error("Usuário não autenticado.");
      const novoSaldo = saldo + valor;
      await saldoService.atualizarSaldo(userId, novoSaldo);
      await atualizarSaldo();
    } catch (error) {
      console.error("Erro ao realizar depósito:", error);
    }
  };

  const transferencia = async (valor: number) => {
    try {
      if (!userId) throw new Error("Usuário não autenticado.");
      const novoSaldo = saldo - valor;
      await saldoService.atualizarSaldo(userId, novoSaldo);
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
      await trasacaoService.adicionarTransacao(userId, transacao);
      await carregarMaisTransacoes(true);
      await atualizarSaldo();
      calcularValue();

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

  const verificaSaldo = (valor: number): boolean => {
    if (valor > saldo) {
      return false;
    }
    return true;
  };

  const atualizarTransacao = async (transacao: Transacao) => {
    try {
      await trasacaoService.atualizarTransacao(userId, transacao.id, transacao);

      await carregarMaisTransacoes(true);
      await atualizarSaldo();
      calcularValue();
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

      await trasacaoService.deletarTransacao(userId, transacao.id);
      await carregarMaisTransacoes(true);
      calcularValue();
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
        setDataFim,
        dataFim,
        setDataInicio,
        dataInicio,
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
