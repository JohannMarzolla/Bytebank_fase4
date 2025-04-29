import React from "react";
import { View } from "react-native";
import Saldo from "../Saldo/Saldo";
import CarouselGraficos from "./CarouselGraficos";

export default function CardGraficos() {
  return (
    <View className="w-full bg-fiap-navy-blue rounded-[8px] mb-8">
      <Saldo />
      <CarouselGraficos />
    </View>
  );
}
