import { ScrollView } from "react-native";
import CardGraficos from "@/presentation/components/Graficos/CardGraficos";
import TransacaoCriarCard from "@/presentation/components/Transacao/TransacaoCriarCard";

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-fiap-light-green p-6 h-full">
      <CardGraficos />
      <TransacaoCriarCard />
    </ScrollView>
  );
}
