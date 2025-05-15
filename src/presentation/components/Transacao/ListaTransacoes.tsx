import { FlatList, ActivityIndicator } from "react-native";
import TransacaoItem from "./TransacaoItem";
import { Transacao } from "@/domain/models/Transacao";
import { Text } from "react-native";

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
  if (!transacoes?.length && !loadingMore) {
    return (
      <Text className="text-fiap-gray text-center">Não há transações</Text>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      keyExtractor={(transacao) => transacao.id as string}
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
