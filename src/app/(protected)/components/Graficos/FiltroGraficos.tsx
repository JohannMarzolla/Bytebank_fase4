import React, { useState } from "react";
import { View } from "react-native";
import { useGraficos } from "@/context/GraficosContext";
import RNPickerSelect from "react-native-picker-select";
import Button from "@/components/ui/Button";
import { colors } from "@/constants/Colors";

export default function FiltroGraficos() {
  const { filtroData, changeFiltro } = useGraficos();
  const [mes, setMes] = useState(filtroData.mes + 1);
  const [ano, setAno] = useState(filtroData.ano);

  const onBuscar = () => {
    changeFiltro(mes - 1, ano);
  };

  return (
    <View className="p-5 gap-3">
      <RNPickerSelect
        placeholder={{ label: "Selecione o mês...", value: null }}
        value={mes}
        style={{
          inputAndroid: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            height: 50,
            backgroundColor: colors.fiap.white,
            borderWidth: 1,
            borderColor: colors.fiap["light-blue"],
          },
        }}
        items={[
          { label: "Janeiro", value: 1 },
          { label: "Fevereiro", value: 2 },
          { label: "Março", value: 3 },
          { label: "Abril", value: 4 },
          { label: "Maio", value: 5 },
          { label: "Junho", value: 6 },
          { label: "Julho", value: 7 },
          { label: "Agosto", value: 8 },
          { label: "Setembro", value: 9 },
          { label: "Outubro", value: 10 },
          { label: "Novembro", value: 11 },
          { label: "Dezembro", value: 12 },
        ]}
        onValueChange={(value) => setMes(value)}
      />

      {/* Seletor de Ano */}
      <RNPickerSelect
        placeholder={{ label: "Selecione o ano...", value: null }}
        value={ano}
        style={{
          inputAndroid: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            height: 50,
            backgroundColor: colors.fiap.white,
            borderWidth: 1,
            borderColor: colors.fiap["light-blue"],
          },
        }}
        items={[
          { label: "2023", value: 2023 },
          { label: "2024", value: 2024 },
          { label: "2025", value: 2025 },
        ]}
        onValueChange={(value) => setAno(value)}
      />

      <Button text="Buscar" onPress={onBuscar} />
    </View>
  );
}
