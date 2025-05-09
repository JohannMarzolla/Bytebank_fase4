import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { GraficoEvolucaoSaldoMes } from "@/application/models/GraficoEvolucaoSaldoMes";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { formatarData, FormatoDataEnum } from "@/shared/utils/formatarData";

export class GraficoService {
  constructor(private readonly repo: ITransacaoRepository) {}

  async getEvolucaoSaldoPorMes(
    userId: string
  ): Promise<GraficoEvolucaoSaldoMes[]> {
    const transacoes = await this.repo.getTransacoes(userId);

    if (!transacoes || transacoes.length === 0) {
      return [];
    }

    const dadosAgrupados = transacoes.reduce((acc, transacao) => {
      const date = new Date(transacao.date);
      const mesAno = formatarData(date, FormatoDataEnum.MES_ANO);

      if (!acc[mesAno]) acc[mesAno] = 0;

      acc[mesAno] +=
        transacao.tipoTransacao === TipoTransacao.DEPOSITO
          ? transacao.valor
          : -transacao.valor;

      return acc;
    }, {} as Record<string, number>);

    let saldoAcumulado = 0;
    const mesesOrdenados = Object.keys(dadosAgrupados).sort();
    const resultado = mesesOrdenados.map((mes) => {
      saldoAcumulado += dadosAgrupados[mes];
      return { mes, saldo: saldoAcumulado } as GraficoEvolucaoSaldoMes;
    });

    return resultado;
  }
}
