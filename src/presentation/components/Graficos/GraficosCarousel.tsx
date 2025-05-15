import React, { useRef } from "react";
import { View, Text, Dimensions, Animated } from "react-native";
import GraficoEntradasSaidas from "./GraficoEntradasSaidas";
import GraficoEvolucaoSaldoPorMes from "./GraficoEvolucaoSaldoPorMes";

const data = [
  {
    type: "pie",
    title: "Depósitos x Transferências",
    component: GraficoEntradasSaidas,
  },
  {
    type: "bar",
    title: "Evolução do saldo por mês 💰",
    component: GraficoEvolucaoSaldoPorMes,
  },
];

export default function GraficosCarousel() {
  const { width } = Dimensions.get("window");
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 items-center justify-center pt-4">
      <Animated.FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View className="items-center" style={{ width: width - 42 }}>
            <Text className="text-lg font-bold text-white mb-2">
              {item.title}
            </Text>
            <View>{item.component ? <item.component /> : null}</View>
          </View>
        )}
      />

      <View className="flex-row py-4">
        {data.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: dotWidth,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#FFF",
                marginHorizontal: 4,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
