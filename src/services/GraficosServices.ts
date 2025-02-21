import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";



export const getAllTransacoesForTipoDepostio = async (userId: string ) =>{
    try {
        const transacoesRef = collection(db, "users", userId, "transacoes", );
        const q = query(transacoesRef, where("tipoTransacao", "==", "deposito"));
        const querySnapshot = await getDocs(q);
    
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

    export const getAllTransacoesForTipoTransferencia = async (userId: string ) =>{
      try {
          const transacoesRef = collection(db, "users", userId, "transacoes", );
          const q = query(transacoesRef, where("tipoTransacao", "==", "transferencia"));
          const querySnapshot = await getDocs(q);
      
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

