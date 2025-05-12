import { Transacao } from "@/domain/models/Transacao";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { TransacaoFirestore } from "@/domain/models/TransacaoFirestore";

export const TransacaoConverter = {
  toFirestore(transacao: Transacao): TransacaoFirestore {
    const date = transacao.date ?? new Date() 
    return {
      id: transacao.id ?? null,
      userId: transacao.userId,
      valor: transacao.valor,
      tipoTransacao: transacao.tipoTransacao,
      file: transacao.file ?? "",
      fileName: transacao.fileName ?? "",
      date:
        date instanceof Date
          ? Timestamp.fromDate(date)
          : Timestamp.fromDate(new Date(date)), 
    };
  },

  fromFirestore(transacao: TransacaoFirestore, id?: string): Transacao {
    return new Transacao({
      id: id ?? transacao.id ?? undefined, // Usa o ID do snapshot se passado
      userId: transacao.userId,
      valor: transacao.valor,
      tipoTransacao: transacao.tipoTransacao,
      file: transacao.file ?? undefined,
      fileName: transacao.fileName ?? undefined,
      date: transacao.date.toDate(),
    });
  },
};

export const TransacaoConverterFirestore: FirestoreDataConverter<Transacao, TransacaoFirestore> = {
  toFirestore(transacao: Transacao): TransacaoFirestore {
    return TransacaoConverter.toFirestore(transacao);
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Transacao {
    const dbTransacao = snapshot.data(options) as TransacaoFirestore;
    return TransacaoConverter.fromFirestore(dbTransacao, snapshot.id);
  },
};
