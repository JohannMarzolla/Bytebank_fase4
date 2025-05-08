import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { colors } from "@/shared/constants/colors";
import { GraficoEntradaSaidaValor } from "@/application/models/GraficoEntradaSaidaValor";
import { GraficoEvolucaoSaldoMes } from "@/application/models/GraficoEvolucaoSaldoMes";
import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { GraficoService } from "@/application/services/GraficoService";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { SaldoRepositoryFirestore } from "@/infrastructure/repositories/SaldoRepository";
import { TransacaoService } from "@/application/services/TransacaoService";

interface GraficosContextData {
  entradasSaidasData: GraficoEntradaSaidaValor[];
  evolucaoSaldoData: GraficoEvolucaoSaldoMes[];
  calcularValue: { (): void };
  changeFiltro: { (mes: number, ano: number): void };
  filtroData: { mes: number; ano: number };
}

const GraficosContext = createContext<GraficosContextData | undefined>(
  undefined
);

interface GraficosProviderProps {
  children: ReactNode;
  graficoService?: GraficoService;
  transacaoService?: TransacaoService;

}

export const GraficosProvider = ({
  children,
  graficoService = new GraficoService(new TransacaoRepository()),
  transacaoService = new TransacaoService (new TransacaoRepository(), new SaldoRepositoryFirestore()),

}: GraficosProviderProps) => {
  const { userId } = useAuth();
  const [filtroData, setFiltroData] = useState(getFiltroDataValorInicial());
  const [entradasSaidasData, setEntradasSaidasData] = useState<
    GraficoEntradaSaidaValor[]
  >([
    { name: "Depósito", value: 0, color: colors.fiap.green },
    { name: "Transferência", value: 0, color: colors.fiap.red },
  ]);
  const [evolucaoSaldoData, setEvolucaoSaldoData] = useState<
    GraficoEvolucaoSaldoMes[]
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
        transacaoService.buscarTransacoesPorTipoEData(
          userId,
          TipoTransacao.DEPOSITO,
          getFiltroDataInicioDate(),
          getFiltroDataFimDate()
        ),
        transacaoService.buscarTransacoesPorTipoEData(
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
      const transacoes = await graficoService.getTransacoesEvolucaoSaldo(
        userId
      );
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
        calcularValue,
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
