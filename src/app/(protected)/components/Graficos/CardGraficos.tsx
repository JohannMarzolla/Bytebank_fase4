import React from "react";
import { View, Text } from "react-native";
import { formatarMoeda } from "@/app/utils/FormatarMoeda";
import { useTransacoes } from "@/context/TransacoesContext";
import CarouselGraficos from "./CarouselGraficos";

export default function CardGraficos2() {
  const { saldo } = useTransacoes();
  const saldoFormato = formatarMoeda(saldo ?? 0);

  return (
    <View className="w-full bg-fiap-navy-blue rounded-[8px] overflow-hidden mb-8">
      <Text className="text-white text-xl font-bold p-6 pb-2">
        Saldo {saldoFormato}
      </Text>

      <CarouselGraficos />
    </View>
  );
}
