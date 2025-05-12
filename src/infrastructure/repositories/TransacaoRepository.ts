import { Transacao } from "@/domain/models/Transacao";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "@/infrastructure/services/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import {
  TransacaoConverterFirestore,
  TransacaoConverter,
} from "@/domain/converters/TransacaoConverter";

export class TransacaoRepository implements ITransacaoRepository {
  async getAll(userId: string): Promise<Transacao[]> {
    try {
      const collection = this._getCollectionRef(userId);
      const querySnapshot = await getDocs(collection);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      return [];
    }
  }
  async getPorTipoEData(
    userId: string,
    tipo: TipoTransacao,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Transacao[]> {
    const collection = this._getCollectionRef(userId);

    const filter = query(
      collection,
      where("tipoTransacao", "==", tipo),
      where("date", ">=", Timestamp.fromDate(dataInicio)),
      where("date", "<=", Timestamp.fromDate(dataFim))
    );

    const querySnapshot = await getDocs(filter);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async getPorFiltro(
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{ transacoes: Transacao[]; lastVisible: any }> {
    try {
      let filtros: any[] = [orderBy("date", "desc"), limit(limite)];
      if (tipoFiltro && tipoFiltro !== "Todos") {
        filtros.push(where("tipoTransacao", "==", tipoFiltro));
      }
      if (dataInicio) {
        filtros.push(where("date", ">=", Timestamp.fromDate(dataInicio)));
      }
      if (dataFim) {
        filtros.push(where("date", "<=", Timestamp.fromDate(dataFim)));
      }
      if (lastDoc) {
        filtros.push(startAfter(lastDoc));
      }

      const collection = this._getCollectionRef(userId);
      const filter = query(collection, ...filtros);
      const querySnapshot = await getDocs(filter);
      const transacoes = querySnapshot.docs.map((doc) => doc.data());

      const lastVisible =
        querySnapshot.docs.length >= limite
          ? querySnapshot.docs[limite - 1]
          : null;

      return { transacoes, lastVisible };
    } catch (error) {
      return { transacoes: [], lastVisible: null };
    }
  }

  async getPorID(
    userId: string,
    transacaoId: string
  ): Promise<Transacao | null> {
    try {
      const docRef = this._getCollectionRefById(transacaoId, userId);
      const querySnapshot = await getDoc(docRef);

      return querySnapshot.exists() ? querySnapshot.data() : null;
    } catch {
      return null;
    }
  }

  async insert(transacao: Transacao): Promise<string | null> {
    if (!transacao.userId) return null;

    const collection = this._getCollectionRef(transacao.userId);
    const toFirestore = transacao;

    console.log("transaçao insert repository", transacao)
      console.log("transaçao  to firestore insert repository", toFirestore)

      const date = transacao.date ?? new Date() 
     const docRef = await addDoc(collection, {
      userId: toFirestore.userId,
      tipoTransacao: toFirestore.tipoTransacao,
      valor: toFirestore.valor,
      date:
        date instanceof Date
          ? Timestamp.fromDate(date)
          : Timestamp.fromDate(new Date(date)),
      file: toFirestore.file ,
      fileName: toFirestore.fileName,
    });
    return docRef.id;
  }

  async update(transacao: Transacao): Promise<boolean> {
    if (!transacao?.id || !transacao?.userId) return false;

    const docRef = this._getCollectionRefById(transacao.id, transacao.userId);
    await updateDoc(docRef, TransacaoConverter.toFirestore(transacao));
    return true;
  }

  async delete(userId: string, transacaoId: string): Promise<boolean> {
    const docRef = this._getCollectionRefById(transacaoId, userId);
    await deleteDoc(docRef);
    return true;
  }

  async uploadFile(file: any): Promise<string | null> {
    if (!file) return null;

    const response = await fetch(file.uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `transacoes/${file.name}`);
    await uploadBytes(fileRef, blob);

    return await getDownloadURL(fileRef);
  }

  private _getCollectionRef(userId: string) {
    return collection(db, "users", userId, "transacoes").withConverter(
      TransacaoConverterFirestore
    );
  }

  private _getCollectionRefById(id: string, userId: string) {
    return doc(db, "users", userId, "transacoes", id).withConverter(
      TransacaoConverterFirestore
    );
  }
}
