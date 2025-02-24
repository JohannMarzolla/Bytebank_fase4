import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export const getSaldo = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.saldo;
    } else {
      console.log("getSaldo - No such document!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    return null;
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
