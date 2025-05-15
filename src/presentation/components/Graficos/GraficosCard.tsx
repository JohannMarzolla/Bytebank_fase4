import React from "react";
import { View } from "react-native";
import Saldo from "../Saldo/Saldo";
import GraficosCarousel from "./GraficosCarousel";
import { SaldoProvider } from "@/presentation/contexts/SaldoContext";
import { GraficosProvider } from "@/presentation/contexts/GraficosContext";

export default function GraficosCard() {
  return (
    <SaldoProvider>
      <GraficosProvider>
        <View className="w-full bg-fiap-navy-blue rounded-[8px] mb-8">
          <Saldo />
          <GraficosCarousel />
        </View>
      </GraficosProvider>
    </SaldoProvider>
  );
}
