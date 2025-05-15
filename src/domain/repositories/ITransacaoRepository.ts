import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { Transacao } from "@/domain/models/Transacao";
import { TransacaoFiltroTipoEnum } from "@/shared/types/TransacaoFiltroTipoEnum";
import { QueryDocumentSnapshot } from "firebase/firestore";

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
    lastDoc: QueryDocumentSnapshot<Transacao> | null,
    tipoFiltro?: TransacaoFiltroTipoEnum,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{
    transacoes: Transacao[];
    lastVisible: QueryDocumentSnapshot<Transacao> | null;
  }>;

  insert(transacao: Transacao): Promise<string | null>;
  update(transacao: Transacao): Promise<boolean>;
  delete(userId: string, transacaoId: string): Promise<boolean>;
  uploadFile(file: File): Promise<string | null>;
}
