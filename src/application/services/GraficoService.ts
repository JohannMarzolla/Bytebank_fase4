import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { formatarData, FormatoDataEnum } from "@/shared/utils/formatarData";
import { GraficoEvolucaoSaldoData } from "@/application/models/GraficoEvolucaoSaldoData";
import { Transacao } from "@/domain/models/Transacao";
import { GraficoValoresPorTipoData } from "@/application/models/GraficoValoresPorTipoData";

export class GraficoService {
  constructor(private readonly transacaoRepo: ITransacaoRepository) {}

  async getEvolucaoSaldoPorMes(
    userId: string
  ): Promise<GraficoEvolucaoSaldoData | null> {
    const transacoes = await this.transacaoRepo.getAll(userId);

    if (!transacoes || transacoes.length === 0) {
      return null;
    }

    const transacoesPorMes = this._agruparTransacoesPorMes(transacoes);
    const saldoPorMes = this._calcularSaldoPorMes(transacoesPorMes);

    if (saldoPorMes?.length) {
      return {
        meses: saldoPorMes.map((t) => t.mes),
        saldos: saldoPorMes.map((t) => t.saldo),
      };
    }
    return null;
  }

  async getValoresPorTipo(
    userId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<GraficoValoresPorTipoData> {
    try {
      if (!userId) return { depositos: 0, transferencias: 0 };

      const [depositos, transferencias] = await Promise.all([
        this.transacaoRepo.getPorTipoEData(
          userId,
          TipoTransacao.DEPOSITO,
          dataInicio,
          dataFim
        ),
        this.transacaoRepo.getPorTipoEData(
          userId,
          TipoTransacao.TRANSFERENCIA,
          dataInicio,
          dataFim
        ),
      ]);

      return {
        depositos: this._calcularValorTotalTransacoes(depositos),
        transferencias: this._calcularValorTotalTransacoes(transferencias),
      };
    } catch (error) {
      throw new Error(
        "Não foi possível buscar os valores cadastrados para cada tipo de transação."
      );
    }
  }

  private _calcularValorTotalTransacoes(valores: Transacao[]) {
    return valores.reduce((acc, total) => acc + total.valor, 0);
  }

  private _calcularSaldoPorMes(meses: Record<string, number>) {
    let saldoAcumulado = 0;
    const mesesOrdenados = Object.keys(meses).sort();
    return mesesOrdenados.map((mes) => {
      saldoAcumulado += meses[mes];
      return { mes, saldo: saldoAcumulado };
    });
  }

  private _agruparTransacoesPorMes(transacoes: Transacao[]) {
    return transacoes.reduce((acc, transacao) => {
      const date = new Date(transacao.date);
      const mesAno = formatarData(date, FormatoDataEnum.MES_ANO);

      if (!acc[mesAno]) acc[mesAno] = 0;

      acc[mesAno] +=
        transacao.tipoTransacao === TipoTransacao.DEPOSITO
          ? transacao.valor
          : -transacao.valor;

      return acc;
    }, {} as Record<string, number>);
  }
}
