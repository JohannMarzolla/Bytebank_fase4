import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Transacao } from "@/models/Transacao";
import { TipoTransacao } from "@/app/types/TipoTransacao";

export const getAllTransacoesPorTipo = async (
  userId: string,
  tipo: TipoTransacao
): Promise<Transacao[]> => {
  try {
    const transacoesRef = collection(db, "users", userId, "transacoes");
    const q = query(transacoesRef, where("tipoTransacao", "==", tipo));
    const querySnapshot = await getDocs(q);

    const transacoes = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Transacao)
    );

    return transacoes;
  } catch (error) {
    console.error(`Erro ao buscar transações do tipo "${tipo}":`, error);
    return [];
  }
};
