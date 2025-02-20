import { ScrollView, View } from "react-native";
import CardNovaTransacao from "../components/CardNovaTransacao";
import Saldo from "../components/Saldo";
import CardGraficos from "../components/Graficos/CardGraficos";

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-fiap-light-green p-6 h-full">
      {/* <Saldo /> */}
      <CardGraficos />
      <CardNovaTransacao />
    </ScrollView>
  );
}
