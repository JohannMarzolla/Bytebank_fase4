import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { colors } from "@/shared/constants/colors";
import { GraficoEvolucaoSaldoData } from "@/presentation/models/GraficoEvolucaoSaldoData";
import { useTransacaoContext } from "./TransacaoContext";
import { useGraficoService } from "@/application/hooks/useGraficoService";
import { ShowToast } from "../components/ui/Toast";
import { GraficoEntradaSaidaValor } from "../models/GraficoEntradaSaidaValor";

interface GraficosContextData {
  entradasSaidasData: GraficoEntradaSaidaValor[];
  evolucaoSaldoPorMes: GraficoEvolucaoSaldoData;
  calcularValue: { (): void };
  changeFiltro: { (mes: number, ano: number): void };
  filtroData: { mes: number; ano: number };
}

const GraficosContext = createContext<GraficosContextData | undefined>(
  undefined
);

interface GraficosProviderProps {
  children: ReactNode;
}

export const GraficosProvider = ({ children }: GraficosProviderProps) => {
  const { userId } = useAuth();
  const { onChangeAddListener, onChangeRemoveListener } = useTransacaoContext();
  const graficoService = useGraficoService();
  const [filtroData, setFiltroData] = useState(getFiltroDataValorInicial());
  const [entradasSaidasData, setEntradasSaidasData] = useState<
    GraficoEntradaSaidaValor[]
  >([
    { name: "Depósito", value: 0, color: colors.fiap.green },
    { name: "Transferência", value: 0, color: colors.fiap.red },
  ]);
  const [evolucaoSaldoPorMes, setEvolucaoSaldoPorMes] =
    useState<GraficoEvolucaoSaldoData>(getEvolucaoSaldoVazio());

  function getEvolucaoSaldoVazio() {
    return { meses: ["vazio"], saldos: [0] };
  }

  function getFiltroDataValorInicial() {
    const hoje = new Date();
    return { mes: hoje.getMonth(), ano: hoje.getFullYear() };
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

  const calcularValue = async () => {
    if (!userId) return null;

    await Promise.all([loadEntradasESaidas(), loadEvolucaoSaldoPorMes()]);
  };

  const loadEvolucaoSaldoPorMes = async () => {
    try {
      const result = await graficoService.getEvolucaoSaldoPorMes(userId);
      setEvolucaoSaldoPorMes(result ?? getEvolucaoSaldoVazio());
    } catch (error) {
      if (error instanceof Error) {
        ShowToast(
          "error",
          error.message || "Erro ao carregar evolução do saldo por mês."
        );
      }
    }
  };

  const loadEntradasESaidas = async () => {
    try {
      const valores = await graficoService.getValoresPorTipo(
        userId,
        getFiltroDataInicioDate(),
        getFiltroDataFimDate()
      );

      const newValues = entradasSaidasData;
      newValues[0].value = valores.depositos;
      newValues[1].value = valores.transferencias;
      setEntradasSaidasData(newValues);
    } catch (error) {
      if (error instanceof Error) {
        ShowToast(
          "error",
          error.message || "Erro ao buscar entradas e saidas."
        );
      }
    }
  };

  useEffect(() => {
    if (!userId) return;

    calcularValue();

    const handleTransacoesAlteradas = () => {
      calcularValue();
    };

    onChangeAddListener(handleTransacoesAlteradas);
    return () => {
      onChangeRemoveListener(handleTransacoesAlteradas);
    };
  }, [filtroData, userId]);

  return (
    <GraficosContext.Provider
      value={{
        calcularValue,
        changeFiltro,
        filtroData,
        entradasSaidasData,
        evolucaoSaldoPorMes,
      }}
    >
      {children}
    </GraficosContext.Provider>
  );
};

export const useGraficosContext = () => {
  const context = useContext(GraficosContext);
  if (!context) {
    throw new Error(
      "contexto não encontado, useTransacao deve estar dentro de TransacaoProvider"
    );
  }
  return context;
};
