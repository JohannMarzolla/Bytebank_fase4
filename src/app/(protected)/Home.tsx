import { ScrollView } from "react-native";
import GraficosCard from "@/presentation/components/Graficos/GraficosCard";
import TransacaoCriarCard from "@/presentation/components/Transacao/TransacaoCriarCard";

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-fiap-light-green p-6 h-full">
      <GraficosCard />
      <TransacaoCriarCard />
    </ScrollView>
  );
}
