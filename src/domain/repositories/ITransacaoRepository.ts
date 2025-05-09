import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { Transacao } from "@/domain/models/Transacao";

export interface ITransacaoRepository {
  getTransacoes(userId: string): Promise<Transacao[]>;
  getTransacao(userId: string, transacaoId: string): Promise<Transacao | null>;

  getTransacoesPorTipoEData(
    userId: string,
    tipo: TipoTransacao,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Transacao[]>;

  getTransacoesLimitId(
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{ transacoes: Transacao[]; lastVisible: any }>;

  postTransacao(userId: string, transacao: Transacao): Promise<string | null>;

  putTransacao(
    userId: string,
    id: string,
    novosDados: Partial<Transacao>
  ): Promise<boolean>;

  deleteTransacao(userId: string, transacaoId: string): Promise<boolean>;

  uploadFile(file: File): Promise<string | null>;
}
