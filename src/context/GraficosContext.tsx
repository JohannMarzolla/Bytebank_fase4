import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getTransacoesEvolucaoSaldo,
  getTransacoesPorTipoEData,
} from "@/services/GraficosServices";
import { colors } from "@/constants/Colors";
import { GraficoEntrasSaidasModel } from "@/models/GraficoEntrasSaidasModel";
import { GraficoPorMesModel } from "@/models/GraficoPorMesModel";
import { TipoTransacao } from "@/app/types/TipoTransacao";

interface GraficosContextData {
  entradasSaidasData: GraficoEntrasSaidasModel[];
  evolucaoSaldoData: GraficoPorMesModel[];
  changeFiltro: { (mes: number, ano: number): void };
  filtroData: { mes: number; ano: number };
}

const GraficosContext = createContext<GraficosContextData | undefined>(
  undefined
);

export const GraficosProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();
  const [filtroData, setFiltroData] = useState(getFiltroDataValorInicial());

  const [entradasSaidasData, setEntradasSaidasData] = useState<
    GraficoEntrasSaidasModel[]
  >([
    { name: "Depósito", value: 0, color: colors.fiap.green },
    { name: "Transferência", value: 0, color: colors.fiap.red },
  ]);
  const [evolucaoSaldoData, setEvolucaoSaldoData] = useState<
    GraficoPorMesModel[]
  >([]);

  useEffect(() => {
    calcularValue();
  }, [filtroData, userId]);

  function getFiltroDataValorInicial() {
    const hoje = new Date();
    return {
      mes: hoje.getMonth(),
      ano: hoje.getFullYear(),
    };
  }

  function getFiltroDataInicioDate() {
    return new Date(filtroData.ano, filtroData.mes, 1, 0, 0, 0);
  }

  function getFiltroDataFimDate() {
    return new Date(filtroData.ano, filtroData.mes + 1, 0, 23, 59, 59);
  }

  const changeFiltro = (mes: number, ano: number) => {
    setFiltroData({ mes, ano });
  };

  const searchEntradasESaidas = async () => {
    try {
      if (!userId) return;

      const [transacoesDeposito, transacoesTransferencia] = await Promise.all([
        getTransacoesPorTipoEData(
          userId,
          TipoTransacao.DEPOSITO,
          getFiltroDataInicioDate(),
          getFiltroDataFimDate()
        ),
        getTransacoesPorTipoEData(
          userId,
          TipoTransacao.TRANSFERENCIA,
          getFiltroDataInicioDate(),
          getFiltroDataFimDate()
        ),
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
      if (!userId) return null;

      await Promise.all([calcularEntradasESaidas(), calcularEvolucaoSaldo()]);
    } catch (error) {
      console.log("Erro ao calcular valores calcularValue:", error);
    }
  };

  const calcularEvolucaoSaldo = async () => {
    try {
      const transacoes = await getTransacoesEvolucaoSaldo(userId);
      setEvolucaoSaldoData(transacoes ?? []);
    } catch (error) {
      console.log("Erro ao calcular valores calcularValuePorMes:", error);
    }
  };

  const calcularEntradasESaidas = async () => {
    try {
      const transacoes = await searchEntradasESaidas();
      if (!transacoes) return;

      const depositoValue = transacoes.depositos.reduce(
        (acc, deposito) => acc + deposito.valor,
        0
      );
      const transferenciaValue = transacoes.transferencia.reduce(
        (acc, transferencia) => acc + transferencia.valor,
        0
      );

      const newValues = entradasSaidasData;
      newValues[0].value = depositoValue;
      newValues[1].value = transferenciaValue;
      setEntradasSaidasData(newValues);
    } catch (error) {
      console.log("Erro ao calcular valores calcularValuePorTipo:", error);
    }
  };

  return (
    <GraficosContext.Provider
      value={{
        // calcularValue,
        changeFiltro,
        filtroData,
        entradasSaidasData,
        evolucaoSaldoData,
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
