import { ScrollView } from "react-native";
import CardNovaTransacao from "@/presentation/components/Transacao/CardNovaTransacao";
import CardGraficos from "@/presentation/components/Graficos/CardGraficos";

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-fiap-light-green p-6 h-full">
      <CardGraficos />
      <CardNovaTransacao />
    </ScrollView>
  );
}
