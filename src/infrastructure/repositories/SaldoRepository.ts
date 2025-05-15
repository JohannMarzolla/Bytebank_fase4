import { ISaldoRepository } from "@/domain/repositories/ISaldoRepository";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/infrastructure/services/FirebaseConfig";

export class SaldoRepository implements ISaldoRepository {
  async get(userId: string): Promise<number | null> {
    if (!userId) throw new Error("Usuário não especificado");

    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.saldo;
      }
      return null;
    } catch (error) {
      throw new Error(
        "Não foi possível recuperar o valor do saldo. Tente novamente."
      );
    }
  }

  async update(userId: string, novoSaldo: number): Promise<boolean> {
    if (!userId) throw new Error("Usuário não especificado");

    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, { saldo: novoSaldo });
      return true;
    } catch (error) {
      throw new Error("Não foi possível atualizar o saldo. Tente novamente.");
    }
  }
}
