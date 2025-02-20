import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatarMoeda } from "@/app/utils/formatarMoeda";
import { colors } from "@/constants/Colors";

// Precisa manter este formato porque é o formato que o PieChart entende
const dados = [
  { name: "Depósito", value: 20000, color: colors.fiap.green },
  { name: "Transferência", value: 7000, color: colors.fiap.red },
];

export default function GraficoEntradasSaidas() {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="flex-row items-center justify-center overflow-hidden">
      <PieChart
        data={dados}
        width={screenWidth / 2 - 30}
        height={200}
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#08130D",
          backgroundGradientTo: "#1E2923",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor={"value"}
        hasLegend={false}
        backgroundColor={"transparent"}
        paddingLeft="0"
        center={[45, 0]}
      />

      <View className="w-1/2 pl-2">
        {dados.map((item, index) => (
          <View key={index} className="flex-row items-center pl-2 pb-2">
            <View
              className={`w-4 h-4 mr-3`}
              style={{
                backgroundColor: item.color,
              }}
            />

            <View className="">
              <Text className="text-white text-lg">{item.name}</Text>
              <Text className="pl-1 text-fiap-light-gray">
                {formatarMoeda(item.value)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
