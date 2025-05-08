import { ISaldoRepository } from "@/domain/repositories/ISaldoRepository";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";

export class SaldoRepositoryFirestore implements ISaldoRepository {
  async getSaldo(userId: string): Promise<number | null> {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.saldo;
    }
    return null;
  }

  async updateSaldo(userId: string, novoSaldo: number): Promise<boolean> {
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { saldo: novoSaldo });
      return true;
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error);
      return false;
    }
  }
}
