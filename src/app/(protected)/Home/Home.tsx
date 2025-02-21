import { ScrollView, View } from "react-native";
import CardNovaTransacao from "../components/CardNovaTransacao";
import Saldo from "../components/Saldo";
import CardGraficos from "../components/Graficos/CardGraficos";
import { useGraficos } from "@/context/GraficosContext";
import { useEffect } from "react";

export default function Home() {
  const {calcularValue, transacoesGraficos} = useGraficos();

    useEffect(()=>{
    calcularValue()
    }, [])

    console.log("tarnsacoes home",transacoesGraficos)


  return (
    <ScrollView className="flex-1 bg-fiap-light-green p-6 h-full">
      {/* <Saldo /> */}
      <CardGraficos />
      <CardNovaTransacao />
    </ScrollView>
  );
}
