import React, { useState } from "react";
import { View } from "react-native";
import { useGraficosContext } from "@/presentation/contexts/GraficosContext";
import Button from "@/presentation/components/ui/Button";
import InputSelect from "@/presentation/components/ui/InputSelect";
import { GraficosFiltroMeses } from "@/shared/constants/graficos-filtro-meses";
import { GraficosFiltroAnos } from "@/shared/constants/graficos-filtro-anos";

export default function GraficosFiltro() {
  const { filtroData, changeFiltro } = useGraficosContext();
  const [mes, setMes] = useState(filtroData.mes + 1);
  const [ano, setAno] = useState(filtroData.ano);

  const onBuscar = () => {
    changeFiltro(mes - 1, ano);
  };

  return (
    <View className="flex p-4 gap-3">
      <InputSelect
        placeholder="Selecione o mês..."
        options={GraficosFiltroMeses}
        style="ligth"
        value={mes}
        onValueChanged={(value) => setMes(value)}
      />

      <InputSelect
        placeholder="Selecione o ano..."
        options={GraficosFiltroAnos}
        style="ligth"
        value={ano}
        onValueChanged={(value) => setAno(value)}
      />

      <Button text="Buscar" onPress={onBuscar} />
    </View>
  );
}
