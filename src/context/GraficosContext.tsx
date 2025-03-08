import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getAllTransacoesByMes,
  getAllTransacoesPorTipo,
} from "@/services/GraficosServices";
import { colors } from "@/constants/Colors";
import { useTransacoes } from "./TransacoesContext";

import { GraficoEntrasSaidasModel } from "@/models/GraficoEntrasSaidasModel";
import { GraficoPorMesModel } from "@/models/GraficoPorMesModel";
import { TipoTransacao } from "@/app/types/TipoTransacao";

interface GraficosContextData {
  getAllTransacoesForTipoTransacaoContext: any;
  transacoesGraficos: GraficoEntrasSaidasModel[];
  transacoesByMes: GraficoPorMesModel[];
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
  const [transacoesByMes, setTransacoesByMes] = useState<GraficoPorMesModel[]>(
    []
  );

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
      await Promise.all([calcularValuePorTipo(), calcularValuePorMes()]);
    } catch (error) {
      console.log("Erro ao calcular valores calcularValue:", error);
    }
  };

  const calcularValuePorMes = async () => {
    try {
      const transacoes = await getAllTransacoesByMes(userId);
      setTransacoesByMes(transacoes ?? []);
    } catch (error) {
      console.log("Erro ao calcular valores calcularValuePorMes:", error);
    }
  };

  const calcularValuePorTipo = async () => {
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
      console.log("Erro ao calcular valores calcularValuePorTipo:", error);
    }
  };

  return (
    <GraficosContext.Provider
      value={{
        getAllTransacoesForTipoTransacaoContext,
        calcularValue,
        transacoesGraficos,
        transacoesByMes,
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
