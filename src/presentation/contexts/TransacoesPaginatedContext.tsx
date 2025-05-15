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
import { TransacaoFiltroTipoEnum } from "@/shared/types/TransacaoFiltroTipoEnum";
import { useTransacaoContext } from "./TransacaoContext";
import { useTransacoesPaginatedService } from "@/application/hooks/useTransacoesPaginatedService";
import { ShowToast } from "@/presentation/components/ui/Toast";

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
  const { onChangeAddListener, onChangeRemoveListener } = useTransacaoContext();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const paginateService = useTransacoesPaginatedService();
  const [tipoFiltro, setTipoFiltro] = useState<TransacaoFiltroTipoEnum>(
    TransacaoFiltroTipoEnum.TODOS
  );
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const pageSize = 5;

  const carregar = async (reset = false) => {
    if (!userId || loading || (!reset && !hasMoreData)) return;

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
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao carregar as transações.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    carregar(true);

    const handleTransacoesAlteradas = () => {
      carregar(true);
    };

    onChangeAddListener(handleTransacoesAlteradas);
    return () => {
      onChangeRemoveListener(handleTransacoesAlteradas);
    };
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

export const useTransacoesPaginatedContext = () => {
  const context = useContext(TransacoesPaginatedContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacao deve estar dentro de TransacaoProvider"
    );
  }
  return context;
};
