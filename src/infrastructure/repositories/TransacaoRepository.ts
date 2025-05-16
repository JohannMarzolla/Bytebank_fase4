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
  QueryDocumentSnapshot,
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
import { TransacaoFiltroTipoEnum } from "@/shared/types/TransacaoFiltroTipoEnum";

export class TransacaoRepository implements ITransacaoRepository {
  async getAll(userId: string): Promise<Transacao[]> {
    if (!userId) throw new Error("Usuário não autenticado");

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
    if (!userId) throw new Error("Usuário não autenticado");
    if (!dataInicio || !dataFim) throw new Error("Intervalo de datas inválido");

    try {
      const collection = this._getCollectionRef(userId);

      const filter = query(
        collection,
        where("tipoTransacao", "==", tipo),
        where("date", ">=", Timestamp.fromDate(dataInicio)),
        where("date", "<=", Timestamp.fromDate(dataFim))
      );

      const querySnapshot = await getDocs(filter);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error(
        "Não foi possível carregar as transações. Tente novamente."
      );
    }
  }

  async getPorFiltro(
    userId: string,
    limite: number,
    lastDoc: QueryDocumentSnapshot<Transacao> | null,
    tipoFiltro?: TransacaoFiltroTipoEnum,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{
    transacoes: Transacao[];
    lastVisible: QueryDocumentSnapshot<Transacao> | null;
  }> {
    if (!userId) throw new Error("Usuário não autenticado");

    try {
      const collection = this._getCollectionRef(userId);
      const filter = query(
        collection,
        ...this._getPorFiltroQueryParams(
          limite,
          lastDoc,
          tipoFiltro,
          dataInicio,
          dataFim
        )
      );
      const querySnapshot = await getDocs(filter);
      const transacoes = querySnapshot.docs.map((doc) => doc.data());

      const docs = querySnapshot.docs;
      const lastVisible = docs.length > 0 ? docs[docs.length - 1] : null;

      return { transacoes, lastVisible };
    } catch (error) {
      return { transacoes: [], lastVisible: null };
    }
  }

  async getPorID(
    userId: string,
    transacaoId: string
  ): Promise<Transacao | null> {
    if (!userId) throw new Error("Usuário não autenticado");
    if (!transacaoId) throw new Error("Código da transação não informado");

    try {
      const docRef = this._getCollectionRefById(transacaoId, userId);
      const querySnapshot = await getDoc(docRef);

      return querySnapshot.exists() ? querySnapshot.data() : null;
    } catch (error) {
      throw new Error(
        "Não foi possível localizar a transação pelo código. Tente novamente."
      );
    }
  }

  async insert(transacao: Transacao): Promise<string | null> {
    if (!transacao) throw new Error("Transação não especificada");
    if (!transacao.userId) throw new Error("Usuário não especificado");

    try {
      const collection = this._getCollectionRef(transacao.userId);
      const docRef = await addDoc(collection, {
        userId: transacao.userId,
        tipoTransacao: transacao.tipoTransacao,
        valor: transacao.valor,
        date: transacao.date,
        file: transacao.file,
        fileName: transacao.fileName,
      });
      return docRef.id;
    } catch (error) {
      throw new Error("Não foi possível inserir a transação. Tente novamente.");
    }
  }

  async update(transacao: Transacao): Promise<boolean> {
    if (!transacao) throw new Error("Transação não especificada");
    if (!transacao.userId) throw new Error("Usuário não especificado");
    if (!transacao.id) throw new Error("Código da transação não informado");

    try {
      const docRef = this._getCollectionRefById(transacao.id, transacao.userId);
      await updateDoc(docRef, TransacaoConverter.toFirestore(transacao));
      return true;
    } catch (error) {
      throw new Error(
        "Não foi possível atualizar a transação. Tente novamente."
      );
    }
  }

  async delete(userId: string, transacaoId: string): Promise<boolean> {
    if (!userId) throw new Error("Usuário não especificado");
    if (!transacaoId) throw new Error("Código da transação não informado");

    try {
      const docRef = this._getCollectionRefById(transacaoId, userId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error("Não foi possível remover a transação. Tente novamente.");
    }
  }

  async uploadFile(file: any): Promise<string | null> {
    if (!file) throw new Error("Arquivo não especificado");

    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const fileRef = ref(storage, `transacoes/${file.name}`);
      await uploadBytes(fileRef, blob);

      return await getDownloadURL(fileRef);
    } catch (error) {
      throw new Error(
        "Não foi possível fazer o upload do arquivo. Tente novamente."
      );
    }
  }

  private _getPorFiltroQueryParams(
    limite: number,
    lastDoc: QueryDocumentSnapshot<Transacao> | null,
    tipoFiltro?: TransacaoFiltroTipoEnum,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ) {
    let filtros: any[] = [];

    if (tipoFiltro && tipoFiltro !== TransacaoFiltroTipoEnum.TODOS) {
      filtros.push(
        where(
          "tipoTransacao",
          "==",
          tipoFiltro === TransacaoFiltroTipoEnum.DEPOSITO
            ? TipoTransacao.DEPOSITO
            : TipoTransacao.TRANSFERENCIA
        )
      );
    }
    if (dataInicio) {
      const dtStart = new Date(dataInicio);
      dtStart.setHours(0, 0, 0, 0);
      filtros.push(where("date", ">=", Timestamp.fromDate(dtStart)));
    }
    if (dataFim) {
      const dtEnd = new Date(dataFim);
      dtEnd.setHours(23, 59, 59, 999);
      filtros.push(where("date", "<", Timestamp.fromDate(dtEnd)));
    }

    const queryParams = [...filtros, orderBy("date", "desc")];
    if (lastDoc) queryParams.push(startAfter(lastDoc));
    queryParams.push(limit(limite));

    return queryParams;
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
