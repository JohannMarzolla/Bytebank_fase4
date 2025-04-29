import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Transacao } from "@/domain/models/Transacao";
import { TipoTransacao } from "@/shared/types/TipoTransacao";
import { GraficoPorMesModel } from "@/domain/models/GraficoPorMesModel";

export const getTransacoesPorTipoEData = async (
  userId: string,
  tipo: TipoTransacao,
  dataInicio: Date,
  dataFim: Date
): Promise<Transacao[]> => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");

    const q = query(
      transacoesRef,
      where("tipoTransacao", "==", tipo),
      where("date", ">=", dataInicio.toISOString()),
      where("date", "<=", dataFim.toISOString())
    );
    const querySnapshot = await getDocs(q);

    const transacoes = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Transacao)
    );

    return transacoes;
  } catch (error) {
    console.error(`Erro ao buscar transações do tipo "${tipo}":`, error);
    return [];
  }
};

export const getTransacoesEvolucaoSaldo = async (
  userId: string
): Promise<GraficoPorMesModel[]> => {
  const transacoesRef = collection(db, "users", userId, "transacoes");
  const querySnapshot = await getDocs(transacoesRef);
  const transacoes = querySnapshot.docs.map((doc) => doc.data()) as Transacao[];
  if (!transacoes) [];

  const dadosAgrupados = transacoes.reduce((acc, transacao) => {
    const date = new Date(transacao.date);
    const mesAno = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!acc[mesAno]) {
      acc[mesAno] = 0;
    }

    acc[mesAno] +=
      transacao.tipoTransacao === TipoTransacao.DEPOSITO
        ? transacao.valor
        : -transacao.valor;

    return acc;
  }, {} as Record<string, number>);

  const mesesOrdenados = Object.keys(dadosAgrupados).sort();

  let saldoAcumulado = 0;
  const resultado = mesesOrdenados.map((mes) => {
    saldoAcumulado += dadosAgrupados[mes];
    return { mes, saldo: saldoAcumulado };
  });

  return resultado;
};
