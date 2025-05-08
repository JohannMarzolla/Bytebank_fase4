import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { Transacao } from "../models/Transacao";

export interface IGraficoRepository {
  getTransacoesPorTipoEData(
    userId: string,
    tipo: TipoTransacao,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Transacao[]>;

  getTransacoes(userId: string): Promise<Transacao[]>;
}
