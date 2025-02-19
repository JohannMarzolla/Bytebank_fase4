import { View, ScrollView } from "react-native";
import TransacoesPage from "../components/TransacoesPage";

export default function Transacoes() {
  
  return (
    <View className="flex-1 p-6 pb-8">
    <View className="flex-1 gap-8">
      <TransacoesPage />
    </View>
  </View>
  )
}
