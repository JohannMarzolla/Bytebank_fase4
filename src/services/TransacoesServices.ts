import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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
    const transacaoRef = doc(db, "users", userId, "transacoes", id);
    await updateDoc(transacaoRef, novosDados);

    console.log(`Transação ${id} atualizada com sucesso!`);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
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
