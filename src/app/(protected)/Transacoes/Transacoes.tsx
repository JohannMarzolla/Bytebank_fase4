import { View, Text } from "react-native";
import InputDate from "@/components/forms/InputDate";
import ListaTransacoes from "../components/ListaTransacoes";
import InputSelect from "@/components/forms/InputSelect";
import { ListaTiposTransacao } from "@/app/types/TipoTransacao";
import { useTransacoes } from "@/context/TransacoesContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Transacao } from "@/models/Transacao";
import { collection, getDocs, limit, query, startAfter } from "firebase/firestore";
import { db } from "../../../../firebase/config";

export default function Transacoes() {
  const { saldo } = useTransacoes();
  console.log("saldo", saldo);

  const { userId } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); 

  const getTransacoes = async (userId: string, limite: number, lastDoc?: any) => {
    if (!userId || loadingMore || !hasMoreData) return;

    try {
      setLoadingMore(true);
      const transacoesRef = collection(db, "users", userId, "transacoes");
      let q = lastDoc
        ? query(transacoesRef, startAfter(lastDoc), limit(limite))
        : query(transacoesRef, limit(limite));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setHasMoreData(false);
        setLoadingMore(false);
        return;
      }

      const novasTransacoes: Transacao[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        date: new Date(doc.data().date),
        tipoTransacao: doc.data().tipoTransacao,
        valor: doc.data().valor,
      }));

      setTransacoes((prev) => [...prev, ...novasTransacoes]);

      const ultimoDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(ultimoDoc);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getTransacoes(userId, 10);
  }, [userId]);

  return (
    <View className="flex-1 pt-6 px-6">
      <View className="bg-white border border-[#ADD8E6] rounded-lg px-4 pt-3 pb-5 mb-4">
        <Text className="pb-3 text-lg font-bold">Filtros</Text>

        <InputSelect
          label="Tipo"
          options={ListaTiposTransacao}
          style="dark"
          value="Transferencia"
          onValueChanged={(value) => console.log("Selecionado:", value)}
        />

        <View className="flex flex-row flex-wrap w-full gap-4">
          {["Data início:", "Data fim:"].map((label, i) => (
            <InputDate key={i} label={label} labelTextBold={false} />
          ))}
        </View>
      </View>

      <ListaTransacoes 
        transacoes={transacoes}
        onEndReached={() => getTransacoes(userId, 10, lastDoc)}
        loadingMore={loadingMore}
      />
    </View>
  );
}
