import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

import { useGraficos } from "@/context/GraficosContext";
import { useTransacoes } from "@/context/TransacoesContext";
import { formatarMoeda } from "@/app/utils/FormatarMoeda";


export default function GraficoEntradasSaidas() {
  const { transacoesGraficos } = useGraficos();
  const screenWidth = Dimensions.get("window").width;
  const { saldo } = useTransacoes();
  const saldoFormato = formatarMoeda(saldo ?? 0);

  return (
    <View>
      <Text className="text-white text-xl font-bold p-6 pb-2">
        Saldo {saldoFormato}
      </Text>

      <View className="flex-row items-center justify-center overflow-hidden">
        <PieChart
          data={transacoesGraficos}
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
          {transacoesGraficos.map((item, index) => (
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
    </View>
  );
}
