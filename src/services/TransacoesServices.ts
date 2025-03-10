import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { Transacao } from "@/models/Transacao";
import { TransacaoAdicionar } from "@/models/TransacaoAdicionar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
export const getTransacoesLimit = async (
  userId: string,
  limite: number,
  lastDoc?: any
) => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");
    let q = lastDoc
      ? query(transacoesRef, startAfter(lastDoc), limit(limite))
      : query(transacoesRef, limit(limite));

    const querySnapshot = await getDocs(q);

    const transacoes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      tipoTransacao: doc.data().tipoTransacao,
      valor: doc.data().valor,
      date: new Date(doc.data().date),
    })) as Transacao[];

    return {
      transacoes,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: !querySnapshot.empty,
    };
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return { transacoes: [], lastVisible: null, hasMore: false };
  }
};
export const getTransacoesLength = async (userId: string, limite: number) => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");
    const q = query(transacoesRef, limit(limite));
    const querySnapshot = await getDocs(q);

    const transacoes = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date ? new Date(data.date.seconds * 1000) : new Date(),
      } as Transacao;
    });

    return transacoes;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
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
    if (userId) console.log("Usuário = ", userId);
    if (id) console.log("ID da transação  = ", id);
    if (!Object.keys(novosDados).length) {
      throw new Error("Nenhum dado fornecido para atualização.");
    }

    const transacaoRef = doc(db, "users", userId, "transacoes", id);
    const docSnap = await getDoc(transacaoRef);
    if (!docSnap.exists()) {
      throw new Error(`A transação com ID ${id} não existe.`);
    }

    await updateDoc(transacaoRef, novosDados);
    console.log(`Transação ${id} atualizada com sucesso!`);

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
