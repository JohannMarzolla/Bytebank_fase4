import { QueryDocumentSnapshot } from "firebase/firestore";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { TransacaoFiltroTipoEnum } from "@/shared/types/TransacaoFiltroTipoEnum";
import { Transacao } from "@/domain/models/Transacao";

export class TransacoesPaginatedService {
  constructor(private transacaoRepo: ITransacaoRepository) {}

  private _lastDoc: QueryDocumentSnapshot<Transacao> | null = null;

  async get(
    userId: string,
    pageSize: number,
    tipo?: TransacaoFiltroTipoEnum,
    dataInicio?: Date | null,
    dataFim?: Date | null,
    fromLast = true
  ): Promise<Transacao[]> {
    if (!fromLast) this._lastDoc = null;

    const { transacoes, lastVisible } = await this.transacaoRepo.getPorFiltro(
      userId,
      pageSize,
      this._lastDoc,
      tipo,
      dataInicio,
      dataFim
    );

    this._lastDoc = lastVisible;
    return transacoes;
  }
}
