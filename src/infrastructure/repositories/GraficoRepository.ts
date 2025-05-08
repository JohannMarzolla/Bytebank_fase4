// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/infrastructure/services/FirebaseConfig";
// import { Transacao } from "@/domain/models/Transacao";
// import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
// import { IGraficoRepository } from "@/domain/repositories/IGraficoRepository";

// export class GraficoRepository implements IGraficoRepository {
//   async getTransacoesPorTipoEData(
//     userId: string,
//     tipo: TipoTransacao,
//     dataInicio: Date,
//     dataFim: Date
//   ): Promise<Transacao[]> {
//     const transacoesRef = collection(db, "users", userId, "transacoes");
//     const q = query(
//       transacoesRef,
//       where("tipoTransacao", "==", tipo),
//       where("date", ">=", dataInicio.toISOString()),
//       where("date", "<=", dataFim.toISOString())
//     );
//     const querySnapshot = await getDocs(q);

//     return querySnapshot.docs.map(
//       (doc) => ({ id: doc.id, ...doc.data() } as Transacao)
//     );
//   }


// }
