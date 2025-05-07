import { formatarMoeda } from "@/shared/utils/formatarMoeda";
import { useTransacoes } from "@/application/contexts/TransacoesContext";
import { Text, View } from "react-native";

export default function Saldo() {
  const { saldo } = useTransacoes();
  const saldoFormato = formatarMoeda(saldo ?? 0);

  return (
    <View className="p-6">
      <Text className="text-white text-xl font-semibold">Bem vindo,</Text>
      <Text className="text-white text-xl">Saldo {saldoFormato}</Text>
    </View>
  );
}
