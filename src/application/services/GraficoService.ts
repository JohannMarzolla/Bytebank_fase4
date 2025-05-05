import { GraficoPorMesModel } from "@/domain/models/GraficoPorMesModel";
import { IGraficoRepository } from "@/domain/models/Graficos";
import { Transacao } from "@/domain/models/Transacao";
import { TipoTransacao } from "@/shared/types/TipoTransacao";

export function GraficoService(repo: IGraficoRepository){
    return{
        async getTransacoesPorTipoEData(userId: string,tipo: TipoTransacao, dataInicio: Date,dataFim: Date):Promise<Transacao[]>{
            return await repo.getTransacoesPorTipoEData(userId, tipo,dataInicio, dataFim)

        },
        async getTransacoesEvolucaoSaldo(userId: string): Promise<GraficoPorMesModel[]> {
            const transacoes = await repo.getTransacoes(userId);
      
            if (!transacoes || transacoes.length === 0) {
              return [];
            }
      
            // Agrupar transações por mês-ano
            const dadosAgrupados = transacoes.reduce((acc, transacao) => {
              const date = new Date(transacao.date);
              const mesAno = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      
              if (!acc[mesAno]) {
                acc[mesAno] = 0;
              }
      
              acc[mesAno] +=
                transacao.tipoTransacao === TipoTransacao.DEPOSITO
                  ? transacao.valor
                  : -transacao.valor;
      
              return acc;
            }, {} as Record<string, number>);
      
            // Ordenar meses
            const mesesOrdenados = Object.keys(dadosAgrupados).sort();
      
            // Calcular saldo acumulado
            let saldoAcumulado = 0;
            const resultado: GraficoPorMesModel[] = mesesOrdenados.map((mes) => {
              saldoAcumulado += dadosAgrupados[mes];
              return { mes, saldo: saldoAcumulado };
            });
      
            return resultado;
          },
        };
      }