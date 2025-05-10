import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { Timestamp } from "firebase/firestore";

export class TransacaoFirestore {
  id: string | null;
  userId: string;
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Timestamp;
  file?: string;
  fileName?: string;

  constructor(obj: TransacaoFirestore) {
    this.id = obj.id;
    this.userId = obj.userId;
    this.tipoTransacao = obj.tipoTransacao ?? TipoTransacao.TRANSFERENCIA;
    this.valor = obj.valor;
    this.date = obj.date ?? Timestamp.fromDate(new Date());
    this.file = obj.file;
    this.fileName = obj.fileName;
  }
}
