import { formatarMoeda } from "@/app/utils/FormatarMoeda";
import { colors } from "@/constants/Colors";
import { useGraficos } from "@/context/GraficosContext";
import React from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Svg, Text as TextSVG } from "react-native-svg";

export default function GraficoEvolucaoSaldo() {
  const screenWidth = Dimensions.get("window").width;
  const { evolucaoSaldoData } = useGraficos();

  const labels = evolucaoSaldoData.length
    ? evolucaoSaldoData.map((t) => t.mes)
    : ["vazio"];
  const valores = evolucaoSaldoData.length
    ? evolucaoSaldoData.map((t) => t.saldo)
    : [0];

  return (
    <ScrollView horizontal={true} className="flex-1">
      <View className="rounded-lg shadow-md">
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: valores,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Verde para indicar crescimento
                strokeWidth: 3,
              },
            ],
          }}
          width={screenWidth - 80}
          height={250}
          yAxisLabel="R$"
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: colors.fiap["light-green"],
            backgroundGradientTo: colors.fiap["light-green"],
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 10 },
            propsForDots: {
              r: "6",
              fill: colors.fiap.green,
            },
          }}
          bezier
          style={{ borderRadius: 10 }}
          renderDotContent={({ x, y, index }) => (
            <Svg key={index}>
              <TextSVG
                x={x}
                y={y - 10}
                fontSize="12"
                fill="black"
                textAnchor="middle"
              >
                {`${formatarMoeda(valores[index] ?? 0)}`}
              </TextSVG>
            </Svg>
          )}
        />
      </View>
    </ScrollView>
  );
}
