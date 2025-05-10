import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { Transacao } from "@/domain/models/Transacao";

export interface ITransacaoRepository {
  getAll(userId: string): Promise<Transacao[]>;
  getPorID(userId: string, transacaoId: string): Promise<Transacao | null>;

  getPorTipoEData(
    userId: string,
    tipo: TipoTransacao,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Transacao[]>;

  getPorFiltro(
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{ transacoes: Transacao[]; lastVisible: any }>;

  insert(transacao: Transacao): Promise<string | null>;
  update(transacao: Transacao): Promise<boolean>;
  delete(userId: string, transacaoId: string): Promise<boolean>;
  uploadFile(file: File): Promise<string | null>;
}
