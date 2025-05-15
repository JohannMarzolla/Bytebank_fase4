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
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { TransacaoFiltroTipoEnum } from "@/shared/types/TransacaoFiltroTipoEnum";
import { TransacoesPaginatedService } from "@/application/services/TransacoesPaginatedService";

interface TransacoesPaginatedContextData {
  transacoes: Transacao[];
  tipoFiltro: TransacaoFiltroTipoEnum;
  dataInicio: Date | null;
  dataFim: Date | null;
  loading: boolean;
  carregar: () => Promise<void>;
  setTipoFiltro: Dispatch<SetStateAction<TransacaoFiltroTipoEnum>>;
  setDataInicio: Dispatch<SetStateAction<Date | null>>;
  setDataFim: Dispatch<SetStateAction<Date | null>>;
}

const TransacoesPaginatedContext = createContext<
  TransacoesPaginatedContextData | undefined
>(undefined);

export const TransacoesPaginatedProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { userId } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const paginateService = new TransacoesPaginatedService(
    new TransacaoRepository()
  );
  const [tipoFiltro, setTipoFiltro] = useState<TransacaoFiltroTipoEnum>(
    TransacaoFiltroTipoEnum.TODOS
  );
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const pageSize = 5;

  const carregar = async (reset = false) => {
    console.log("carregar", userId, loading, hasMoreData);
    if (!userId || loading || (!reset && !hasMoreData)) return;
    console.log("carregar 2", dataInicio, dataFim);

    try {
      setLoading(true);

      const novasTransacoes = await paginateService.get(
        userId,
        pageSize,
        tipoFiltro,
        dataInicio,
        dataFim,
        !reset
      );

      setTransacoes((prev) =>
        reset ? novasTransacoes : [...prev, ...novasTransacoes]
      );
      setHasMoreData(novasTransacoes.length === pageSize);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect", dataInicio, dataFim);
    carregar(true);
  }, [userId, tipoFiltro, dataInicio, dataFim]);

  return (
    <TransacoesPaginatedContext.Provider
      value={{
        transacoes,
        tipoFiltro,
        dataFim,
        dataInicio,
        loading,
        carregar,
        setTipoFiltro,
        setDataFim,
        setDataInicio,
      }}
    >
      {children}
    </TransacoesPaginatedContext.Provider>
  );
};

export const useTransacoesPaginated = () => {
  const context = useContext(TransacoesPaginatedContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacoes deve estar dentro de TransacoesProvider"
    );
  }
  return context;
};
