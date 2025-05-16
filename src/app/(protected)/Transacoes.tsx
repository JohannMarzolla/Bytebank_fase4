import { View, Text } from "react-native";
import InputDate from "@/presentation/components/ui/InputDate";
import InputSelect from "@/presentation/components/ui/InputSelect";
import React from "react";
import ListaTransacoes from "@/presentation/components/Transacao/ListaTransacoes";
import { ListaTiposTransacaoFiltro } from "@/shared/constants/tipos-transacao";
import {
  TransacoesPaginatedProvider,
  useTransacoesPaginatedContext,
} from "@/presentation/contexts/TransacoesPaginatedContext";

function TelaDeTransacoes() {
  const {
    loading,
    transacoes,
    tipoFiltro,
    dataFim,
    dataInicio,
    carregar,
    setTipoFiltro,
    setDataInicio,
    setDataFim,
  } = useTransacoesPaginatedContext();

  return (
    <View className="flex-1 pt-6 px-6">
      <View className="bg-white border border-[#ADD8E6] rounded-lg px-4 pt-3 pb-5 mb-4">
        <Text className="pb-3 text-lg font-bold">Filtros</Text>

        <View className="flex w-full gap-4">
          <InputSelect
            label="Tipo"
            labelTextBold={false}
            options={ListaTiposTransacaoFiltro}
            style="dark"
            value={tipoFiltro}
            onValueChanged={setTipoFiltro}
          />

          <InputDate
            label="Data inicio:"
            labelTextBold={false}
            style="dark"
            value={dataInicio}
            showClearButton={true}
            onValueChanged={setDataInicio}
          />
          <InputDate
            label="Data fim:"
            labelTextBold={false}
            style="dark"
            value={dataFim}
            showClearButton={true}
            onValueChanged={setDataFim}
          />
        </View>
      </View>

      <ListaTransacoes
        transacoes={transacoes}
        onEndReached={() => {
          carregar();
        }}
        loadingMore={loading}
      />
    </View>
  );
}

export default function Transacoes() {
  return (
    <TransacoesPaginatedProvider>
      <TelaDeTransacoes />
    </TransacoesPaginatedProvider>
  );
}
