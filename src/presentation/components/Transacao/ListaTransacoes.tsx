import { FlatList, ActivityIndicator } from "react-native";
import TransacaoItem from "./TransacaoItem";
import { Transacao } from "@/domain/models/Transacao";

export interface ListaTransacoesOptions {
  transacoes: Transacao[];
  onEndReached: () => void;
  loadingMore: boolean;
}

export default function ListaTransacoes({
  transacoes = [],
  onEndReached,
  loadingMore,
}: ListaTransacoesOptions) {
  return (
    <FlatList
      style={{ flex: 1 }}
      keyExtractor={(transacao) => transacao.id}
      data={transacoes}
      renderItem={({ item }) => <TransacaoItem transacao={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size="large" /> : null
      }
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}
