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
import { db, storage } from "../../firebase/config";
import { Transacao } from "@/models/Transacao";
import { TransacaoAdicionar } from "@/models/TransacaoAdicionar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getSaldo, postSaldo } from "./SaldoServices";
import { TipoTransacao } from "@/app/types/TipoTransacao";

export const getTransacoes = async (userId: string) => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");
    const querySnapshot = await getDocs(transacoesRef);

    const transacoes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return transacoes;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
};
export const getTransacoesLimitId = async (
  userId: string,
  limite: number,
  lastDoc?: any,
  tipoFiltro?: string
) => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");

    if (tipoFiltro === undefined) {
      console.warn("⚠️ tipoFiltro está indefinido, retornando lista vazia.");
      return { transacoes: [], lastVisible: null };
    }

    let q;
    if (tipoFiltro === "Todos") {
      q = query(
        transacoesRef,
        orderBy("date", "desc"), 
        limit(limite)
      );
    } else {
      q = query(
        transacoesRef,
        where("tipoTransacao", "==", tipoFiltro),
        orderBy("date", "desc"), 
        limit(limite)
      );
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { transacoes: [], lastVisible: null };
    }

    const transacoes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      tipoTransacao: doc.data().tipoTransacao,
      valor: doc.data().valor,
      date: new Date(doc.data().date),
    })) as Transacao[];

    const lastVisible = querySnapshot.docs.length >= limite 
      ? querySnapshot.docs[limite - 1] 
      : null;

    return { transacoes, lastVisible };
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return { transacoes: [], lastVisible: null };
  }
};
export const getTransacao = async (userId: string, transacaoId: string) => {
  try {
    const transacaoRef = doc(db, "users", userId, "transacoes", transacaoId);
    const transacaoSnap = await getDoc(transacaoRef);

    if (transacaoSnap.exists()) {
      return { id: transacaoSnap.id, ...transacaoSnap.data() };
    } else {
      console.log("Transação não encontrada!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    return null;
  }
};

export const postTransacao = async (
  userId: string,
  transacao: TransacaoAdicionar
) => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");

    let fileUrl = null;
    if (transacao.file) {
      fileUrl = await uploadFile(transacao.file);
    }

    const newTransacao = {
      userId,
      tipoTransacao: transacao.tipoTransacao,
      valor: transacao.valor,
      date: transacao.date.toISOString(),
      file: fileUrl,
      fileName: fileUrl ? transacao.file?.name : null,
    };

    const docRef = await addDoc(transacoesRef, newTransacao);

    console.log("Transação adicionada com sucesso:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
    return null;
  }
};

export const putTransacao = async (
  userId: string,
  id: string,
  novosDados: Partial<Transacao>
) => {
  try {
    if (!userId || !id) {
      throw new Error("Usuário ou ID da transação inválido.");
    }
    if (!Object.keys(novosDados).length) {
      throw new Error("Nenhum dado fornecido para atualização.");
    }
    const dadosAtualizados = {
      ...novosDados,
      date: novosDados.date instanceof Date 
        ? novosDados.date.toISOString() 
        : novosDados.date,
    };

    const transacaoRef = doc(db, "users", userId, "transacoes", id);
    const docSnap = await getDoc(transacaoRef);

    if (!docSnap.exists()) {
      throw new Error(`A transação com ID ${id} não existe.`);
    }

    const transacaoAntiga = docSnap.data() as Transacao;
    await updateDoc(transacaoRef, dadosAtualizados);
    console.log(`Transação ${id} atualizada com sucesso!`);

    const saldoAtual = await getSaldo(userId);
    if (saldoAtual === null) {
      throw new Error("Não foi possível obter o saldo atual.");
    }

    let novoSaldo = saldoAtual;

    transacaoAntiga.tipoTransacao === "deposito"
      ? novoSaldo -= transacaoAntiga.valor ?? 0
      : novoSaldo += transacaoAntiga.valor ?? 0; 
    

    novosDados.tipoTransacao === "deposito" 
      ? novoSaldo += novosDados.valor ?? 0
      : novoSaldo -= novosDados.valor ?? 0; 
    

    await postSaldo(userId, novoSaldo);
    console.log("Saldo atualizado:", novoSaldo);

    return true;
  } catch (error) {
    console.error("Erro ao atualizar transação putTransacao:", error);
    return false;
  }
};
export const deleteTransacao = async (userId: string, transacaoId: string) => {
  try {
    const transacaoRef = doc(db, "users", userId, "transacoes", transacaoId);
    await deleteDoc(transacaoRef);

    console.log(`Transação ${transacaoId} deletada com sucesso!`);
    return true;
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return false;
  }
};

async function uploadFile(file: any) {
  if (!file) return null;

  const response = await fetch(file.uri);
  const blob = await response.blob();

  const fileRef = ref(storage, `transacoes/${file.name}`);
  await uploadBytes(fileRef, blob);

  return await getDownloadURL(fileRef);
}
