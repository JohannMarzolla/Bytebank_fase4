import { ISaldoRepository } from "@/domain/repositories/ISaldoRepository";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/infrastructure/services/FirebaseConfig";

export class SaldoRepositoryFirestore implements ISaldoRepository {
  async get(userId: string): Promise<number | null> {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.saldo;
    }
    return null;
  }

  async update(userId: string, novoSaldo: number): Promise<boolean> {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { saldo: novoSaldo });
    return true;
  }
}
