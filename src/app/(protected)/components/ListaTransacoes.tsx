import { useTransacoes } from "@/context/TransacoesContext";
import { Transacao } from "@/models/Transacao";
import { View,  FlatList } from "react-native";
import TransacaoItem from "./TransacaoItem";


export interface ListaTransacoesOptions {
  transacoes: Transacao[];
}

export default function ListaTransacoes({ transacoes}: ListaTransacoesOptions) {

    return (
     <FlatList
     keyExtractor={transacao => transacao.valor.toString()}
     data={transacoes}
     renderItem={({ item }) => <TransacaoItem transacao={item} />}
     ItemSeparatorComponent={() => <View className="h-px bg-fiap-green my-2" />}
    
   />
    );
  }
