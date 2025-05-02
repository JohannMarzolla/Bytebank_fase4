import { TipoTransacao } from "@/shared/types/TipoTransacao";
import { TransacaoAdicionar } from "./TransacaoAdicionar";

export interface Transacao {
  id: string;
  userId?: string;
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Date;
  fileName?: string;
}

export interface ITransacaoRepository {
  getTransacoes(userId: string): Promise<Transacao[] >;
  getTransacoesLimitId (
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{ transacoes: Transacao[]; lastVisible: any  }>;
  getTransacao(userId: string, transacaoId: string): Promise<Transacao | null>;
  postTransacao(userId: string, transacao: TransacaoAdicionar): Promise<string | null>;
  putTransacao(userId: string, id: string, novosDados: Partial<Transacao>): Promise<boolean>;
}