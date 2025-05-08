import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { Transacao } from "../models/Transacao";

export interface ITransacaoRepository {
  getTransacoes(userId: string): Promise<Transacao[]>;
  
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
  getTransacao(userId: string, transacaoId: string): Promise<Transacao | null>;

  postTransacao(userId: string, transacao: Transacao): Promise<string | null>;

  putTransacao(
    userId: string,
    id: string,
    novosDados: Partial<Transacao>
  ): Promise<boolean>;
  deleteTransacao(userId: string,transacaoId:string):Promise<boolean>;
  
  uploadFile(file: File): Promise<string | null>;
}
