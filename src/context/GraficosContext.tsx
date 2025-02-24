import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getAllTransacoesPorTipo } from "@/services/GraficosServices";
import { colors } from "@/constants/Colors";
import { useTransacoes } from "./TransacoesContext";
import { TipoTransacao } from "@/app/types/TipoTransacao";
import { GraficoEntrasSaidasModel } from "@/models/GraficoEntrasSaidasModel";

interface GraficosContextData {
  getAllTransacoesForTipoTransacaoContext: any;
  transacoesGraficos: GraficoEntrasSaidasModel[];
  calcularValue: any;
}

const GraficosContext = createContext<GraficosContextData | undefined>(
  undefined
);

export const GraficosProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const { transacoes } = useTransacoes();

  const [transacoesGraficos, setTransacoesGraficos] = useState<
    GraficoEntrasSaidasModel[]
  >([
    { name: "Depósito", value: 0, color: colors.fiap.green },
    { name: "Transferência", value: 0, color: colors.fiap.red },
  ]);

  useEffect(() => {
    calcularValue();
  }, [transacoes]);

  const getAllTransacoesForTipoTransacaoContext = async () => {
    try {
      if (!userId) return;

      const [transacoesDeposito, transacoesTransferencia] = await Promise.all([
        getAllTransacoesPorTipo(userId, TipoTransacao.DEPOSITO),
        getAllTransacoesPorTipo(userId, TipoTransacao.TRANSFERENCIA),
      ]);
      return {
        depositos: transacoesDeposito,
        transferencia: transacoesTransferencia,
      };
    } catch (error) {
      console.log("Erro ao atualizar as transações", error);
      return { depositos: [], transferencia: [] };
    }
  };

  const calcularValue = async () => {
    try {
      const transacoes = await getAllTransacoesForTipoTransacaoContext();
      if (!transacoes) return;

      const depositoValue = transacoes.depositos.reduce(
        (acc, deposito) => acc + deposito.valor,
        0
      );
      const transferenciaValue = transacoes.transferencia.reduce(
        (acc, transferencia) => acc + transferencia.valor,
        0
      );

      const newValues = transacoesGraficos;
      newValues[0].value = depositoValue;
      newValues[1].value = transferenciaValue;
      setTransacoesGraficos(newValues);
    } catch (error) {
      console.log("Erro ao calcular valores:", error);
    }
  };

  return (
    <GraficosContext.Provider
      value={{
        getAllTransacoesForTipoTransacaoContext,
        calcularValue,
        transacoesGraficos,
      }}
    >
      {children}
    </GraficosContext.Provider>
  );
};

export const useGraficos = () => {
  const context = useContext(GraficosContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacoes deve estar dentro de TransacoesProvider"
    );
  }
  return context;
};
