import { useTransacoes } from "@/context/TransacoesContext";
import { Transacao } from "@/models/Transacao";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableHighlight } from "react-native";


export interface ListaTransacoesOptions {
  transacoes: Transacao[];
}

export default function ListaTransacoes({ transacoes}: ListaTransacoesOptions) {
    const {  deletarTransacao } = useTransacoes();

  
    function handleDelete(transacao: Transacao) {
      deletarTransacao(transacao);
    }
  
    return (
      <View className="p-4">
        {transacoes.length === 0 ? (
          <Text className="text-center text-gray-500">
            Nenhuma transação encontrada.
          </Text>
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
                onPress={() => handleDelete(transacao)}
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
