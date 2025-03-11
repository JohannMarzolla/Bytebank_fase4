import React, { useState } from "react";
import { View } from "react-native";
import { useGraficos } from "@/context/GraficosContext";
import Button from "@/components/ui/Button";
import InputSelect, { InputSelectOption } from "@/components/forms/InputSelect";

const meses: InputSelectOption[] = [
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
];

const anos: InputSelectOption[] = [
  { label: "2023", value: 2023 },
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 },
];

export default function FiltroGraficos() {
  const { filtroData, changeFiltro } = useGraficos();
  const [mes, setMes] = useState(filtroData.mes + 1);
  const [ano, setAno] = useState(filtroData.ano);

  const onBuscar = () => {
    changeFiltro(mes - 1, ano);
  };

  return (
    <View className="flex p-4 gap-3">
      <InputSelect
        placeholder="Selecione o mês..."
        options={meses}
        style="ligth"
        value={mes}
        onValueChanged={(value) => setMes(value)}
      />

      <InputSelect
        placeholder="Selecione o ano..."
        options={anos}
        style="ligth"
        value={ano}
        onValueChanged={(value) => setAno(value)}
      />

      <Button text="Buscar" onPress={onBuscar} />
    </View>
  );
}
