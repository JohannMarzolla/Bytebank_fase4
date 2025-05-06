// screens/Transacoes.tsx
import { View, Text } from "react-native";
import InputDate from "@/presentation/components/ui/InputDate";
import InputSelect from "@/presentation/components/ui/InputSelect";
import { useTransacoes } from "@/presentation/contexts/TransacoesContext";
import React, { useCallback } from "react";
import ListaTransacoes from "@/presentation/components/Transacao/ListaTransacoes";
import { ListaTiposTransacaoInputSelect } from "@/shared/constants/tipos-transacao";

export default function Transacoes() {
  const {
    transacoesLista,
    carregarMaisTransacoes,
    loading,
    setTipoFiltro,
    tipoFiltro,
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
  } = useTransacoes();

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

        <View className="flex flex-row flex-wrap w-full gap-4">
          <InputSelect
            label="Tipo"
            labelTextBold={false}
            options={ListaTiposTransacaoInputSelect}
            style="dark"
            value={tipoFiltro}
            onValueChanged={handleFilterChange}
          />

          <InputDate
            label="Data inicio:"
            labelTextBold={false}
            style="dark"
            value={dataInicio}
            onValueChanged={(date) => setDataInicio(date)}
          />
          <InputDate
            label="Data fim:"
            labelTextBold={false}
            style="dark"
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
