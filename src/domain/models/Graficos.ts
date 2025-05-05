import { TipoTransacao } from "@/shared/types/TipoTransacao";
import { Transacao } from "./Transacao";
import { GraficoPorMesModel } from "./GraficoPorMesModel";

export interface IGraficoRepository {
    getTransacoesPorTipoEData(
      userId: string,
      tipo: TipoTransacao,
      dataInicio: Date,
      dataFim: Date
    ): Promise<Transacao[]>;
  
    getTransacoes(userId: string): Promise<Transacao[]>;
  }