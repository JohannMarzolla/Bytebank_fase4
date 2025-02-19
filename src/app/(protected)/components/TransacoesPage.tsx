import React from "react";
import { View, Text } from "react-native";
import Button from "@/components/ui/Button";
import ListaTransacoes from "./ListaTransacoes";
import { useTransacoes } from "@/context/TransacoesContext";
import InputDate from "@/components/forms/InputDate";

export default function TransacoesPage() {
  const { transacoes } = useTransacoes();

  return (
    <View className="flex-1 bg-fiap-white shadow-md rounded-lg p-6 w-126">
      <Text className="font-bold text-lg mb-4">Transferências</Text>

      <View className="bg-white border border-fiap-light-blue rounded px-4 pt-3 pb-5 mb-4">
        <Text className="pb-3">Filtros</Text>

        <View className="flex-row max-sm:flex-col gap-2 mb-4">
          {["Todos", "Depósitos", "Transferências"].map((filtro) => (
            <Button key={filtro} text={filtro} color="blue" />
          ))}
        </View>

        <View className="flex-row max-sm:flex-col w-full gap-4">
          {["Data início:", "Data fim:"].map((label, i) => (
            <InputDate key={i} label={label} labelTextBold={false} />
          ))}
        </View>
      </View>

      <ListaTransacoes transacoes={transacoes} />
    </View>
  );
}
