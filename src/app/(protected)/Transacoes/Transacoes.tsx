import { TipoTransacao } from "@/app/types/tipoTransacao";
import { useAuth } from "@/context/AuthContext";
import { useTransacoes } from "@/context/TransacoesContext";
import { View, Text, TouchableHighlight } from "react-native";

export default function Transacoes() {
  const { transacoes, deletarTransacao } = useTransacoes();
  const { userId } = useAuth();
  // id de transaçoes é gerado pelo firebase , nao tem o campo id em transaçoes para nao ficar com dois ids iguais
  //  por isso o vscode reclama

  function handleDelete(userid : any,transacaoId: string, tipoTransacao: string, valor: number) {
    deletarTransacao(userId, transacaoId, tipoTransacao,valor,);
  }

  console.log("transacao id", transacoes.map((transacao)=>
  transacao.id))

  return (
    <View className="p-4">
      {transacoes.length === 0 ? (
        <Text className="text-center text-gray-500">Nenhuma transação encontrada.</Text>
      ) : (
        transacoes.map((transacao, index) => (
          <View
            key={index}
            className="flex-row justify-between items-center p-4 bg-gray-100 rounded-lg mb-2"
          >
            <Text className="text-lg">
              {transacao.tipoTransacao} - {transacao.valor}
            </Text>
            <TouchableHighlight
              onPress={() => handleDelete(userId, transacao.id, transacao.tipoTransacao, transacao.valor)}
              className="px-4 py-2 bg-red-500 rounded-lg"
              underlayColor="#c53030"
            >
              <Text className="text-white font-bold">Excluir</Text>
            </TouchableHighlight>
          </View>
        ))
      )}
    </View>
  );
}
