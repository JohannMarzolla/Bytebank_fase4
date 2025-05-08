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
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../services/FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";

export class TransacaoRepository implements ITransacaoRepository {
  
  async getTransacoes(userId: string): Promise<Transacao[]> {
    try {
      const transacoesRef = collection(db, "users", userId, "transacoes");
      const querySnapshot = await getDocs(transacoesRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transacao[];
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return [];
    }
  }
   async getTransacoesPorTipoEData(
      userId: string,
      tipo: TipoTransacao,
      dataInicio: Date,
      dataFim: Date
    ): Promise<Transacao[]> {
      const transacoesRef = collection(db, "users", userId, "transacoes");
      const q = query(
        transacoesRef,
        where("tipoTransacao", "==", tipo),
        where("date", ">=", dataInicio.toISOString()),
        where("date", "<=", dataFim.toISOString())
      );
      const querySnapshot = await getDocs(q);
  
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Transacao)
      );
    }

  async getTransacoesLimitId(
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ): Promise<{ transacoes: Transacao[]; lastVisible: any }> {
    try {
      const transacoesRef = collection(db, "users", userId, "transacoes");
      let filtros: any[] = [orderBy("date", "desc"), limit(limite)];
      if (tipoFiltro && tipoFiltro !== "Todos")
        filtros.push(where("tipoTransacao", "==", tipoFiltro));
      if (dataInicio)
        filtros.push(where("date", ">=", dataInicio.toISOString()));
      if (dataFim) filtros.push(where("date", "<=", dataFim.toISOString()));
      if (lastDoc) filtros.push(startAfter(lastDoc));
      const q = query(transacoesRef, ...filtros);
      const querySnapshot = await getDocs(q);
      const transacoes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        tipoTransacao: doc.data().tipoTransacao,
        valor: doc.data().valor,
        date: new Date(doc.data().date),
        fileName: doc.data().fileName,
      })) as Transacao[];
      const lastVisible =
        querySnapshot.docs.length >= limite
          ? querySnapshot.docs[limite - 1]
          : null;
      return { transacoes, lastVisible };
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return { transacoes: [], lastVisible: null };
    }
  }

  async getTransacao(
    userId: string,
    transacaoId: string
  ): Promise<Transacao | null> {
    try {
      const transacaoRef = doc(db, "users", userId, "transacoes", transacaoId);
      const transacaoSnap = await getDoc(transacaoRef);
      if (transacaoSnap.exists())
        return {
          id: transacaoSnap.id,
          ...transacaoSnap.data(),
        } as Transacao;
      console.log("Transação não encontrada!");
      return null;
    } catch (error) {
      console.error("Erro ao buscar transação:", error);
      return null;
    }
  }

  async postTransacao(
    userId: string,
    transacao: Transacao
  ): Promise<string | null> {
    try {
      const transacoesRef = collection(db, "users", userId, "transacoes");
      const docRef = await addDoc(transacoesRef, transacao);
      console.log("Transação adicionada com sucesso:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      return null;
    }
  }

  async putTransacao(
    userId: string,
    id: string,
    novosDados: Partial<Transacao>
  ): Promise<boolean> {
    try {
      const transacaoRef = doc(db, "users", userId, "transacoes", id);
      await updateDoc(transacaoRef, novosDados);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      return false;
    }
  }

  async deleteTransacao(userId: string, transacaoId: string): Promise<boolean> {
    try {
      const transacaoRef = doc(db, "users", userId, "transacoes", transacaoId);
      await deleteDoc(transacaoRef);
      return true;
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      return false;
    }
  }

  async uploadFile(file: any): Promise<string | null> {
    if (!file) return null;
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `transacoes/${file.name}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  }
}
