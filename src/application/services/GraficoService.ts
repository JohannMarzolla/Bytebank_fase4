import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { GraficoEvolucaoSaldoMes } from "@/application/models/GraficoEvolucaoSaldoMes";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";

export class GraficoService {
  constructor(private readonly repo: ITransacaoRepository) {}

  async getTransacoesEvolucaoSaldo(
    userId: string
  ): Promise<GraficoEvolucaoSaldoMes[]> {
    const transacoes = await this.repo.getTransacoes(userId);

    if (!transacoes || transacoes.length === 0) {
      return [];
    }

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
    const resultado: GraficoEvolucaoSaldoMes[] = mesesOrdenados.map((mes) => {
      saldoAcumulado += dadosAgrupados[mes];
      return { mes, saldo: saldoAcumulado };
    });

    return resultado;
  }
}
