// screens/Transacoes.tsx
import { View, Text } from "react-native";
import InputDate from "@/components/forms/InputDate";
import ListaTransacoes from "../components/ListaTransacoes";
import InputSelect from "@/components/forms/InputSelect";
import { useTransacoes } from "@/context/TransacoesContext";
import { ListaTiposTransacaoInputSelect } from "@/app/types/TipoTransacao";
import React, { useCallback } from "react";

export default function Transacoes() {
  const { 
    transacoesLista, 
    carregarMaisTransacoes, 
    loading, 
    setTipoFiltro, 
    tipoFiltro , 
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim } = useTransacoes();

  const handleEndReached = useCallback(() => {
    carregarMaisTransacoes();
  }, [carregarMaisTransacoes]);

  const handleFilterChange = (value: string) => {
    setTipoFiltro(value as "Todos" | "deposito" | "transferencia");
    
  };


  return (
    <View className="flex-1 pt-6 px-6">
      <View className="bg-white border border-[#ADD8E6] rounded-lg px-4 pt-3 pb-5 mb-4">
        <Text className="pb-3 text-lg font-bold">Filtros</Text>
        
        <InputSelect
          label="Tipo"
          options={ListaTiposTransacaoInputSelect}
          style="dark"
          value={tipoFiltro}
          onValueChanged={handleFilterChange}
        />

        <View className="flex flex-row flex-wrap w-full gap-4">
            <InputDate 
            label="Data inicio:" 
            labelTextBold={false}
            value={dataInicio}
            onValueChanged={(date) => setDataInicio(date)}
            />
            <InputDate 
            label="Data fim:" 
            labelTextBold={false}
            value={dataFim}
            onValueChanged={(date) => setDataFim(date)}
            />
        </View>
      </View>

      <ListaTransacoes 
        transacoes={transacoesLista}
        onEndReached={handleEndReached}
        loadingMore={loading}
      />
    </View>
  );
}