import { Transacao } from "../models/Transacao";

export interface ITransacaoRepository {
  getTransacoes(userId: string): Promise<Transacao[]>;

  getTransacoesLimitId(
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{ transacoes: Transacao[]; lastVisible: any }>;
  getTransacao(userId: string, transacaoId: string): Promise<Transacao | null>;

  postTransacao(userId: string, transacao: Transacao): Promise<string | null>;

  putTransacao(
    userId: string,
    id: string,
    novosDados: Partial<Transacao>
  ): Promise<boolean>;
}
