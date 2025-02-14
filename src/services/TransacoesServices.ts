import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Transacao } from "@/models/Transacao";
import { TransacaoAdicionar } from "@/models/TransacaoAdicionar";

export const getSaldo = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.saldo;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    return null;
  }
};

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

export const postSaldo = async (userId: string, novoSaldo: number) => {
  try {
    const docRef = doc(db, "users", userId);

    await updateDoc(docRef, {
      saldo: novoSaldo,
    });

    console.log(`Saldo atualizado para ${novoSaldo}`);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar saldo:", error);
    return false;
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
    const newTransacao: Transacao = { ...transacao, userId };
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
  transacaoId: string,
  novosDados: Partial<Transacao>
) => {
  try {
    const transacaoRef = doc(db, "users", userId, "transacoes", transacaoId);
    await updateDoc(transacaoRef, novosDados);

    console.log(`Transação ${transacaoId} atualizada com sucesso!`);
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
