
import { formatarData } from "@/app/utils/FormatarData";
import { formatarMoeda } from "@/app/utils/FormatarMoeda";
import { useTransacoes } from "@/context/TransacoesContext";
import { Image, Text, View } from "react-native";

export default function Saldo() {
  const { saldo } = useTransacoes();
  const saldoFormato = formatarMoeda(saldo ?? 0);
  const dataFormatada = formatarData(new Date());

  return (
    <View className="relative w-full bg-fiap-navy-blue rounded-[8px] p-6 mb-8">
      <View className="w-full z-20">
        <Text className="text-white text-2xl font-semibold pb-2">
          Olá, nome!
        </Text>
        <Text className="text-white text-sm">{dataFormatada}</Text>
      </View>

      <View className="w-full z-20 pt-6">
        <View className="flex-row items-center border-b-2 border-white pb-2">
          <Text className="text-white text-lg font-bold">Saldo</Text>
        </View>
        <Text className="text-white text-base pt-4">Conta Corrente</Text>
        <Text className="text-white text-3xl font-bold pt-1">
          {saldoFormato}
        </Text>
      </View>

      <Image
        className="mb-4 mt-5 z-10"
        source={require("@/assets/images/saldo-home.png")}
        style={{ width: 280, height: 230 }}
        resizeMode="cover"
      />
      <Image
        className="absolute top-0 right-0"
        source={require("@/assets/images/pixels-saldo.png")}
        style={{ width: 145, height: 143 }}
        resizeMode="cover"
      />
      <Image
        className="absolute bottom-0 left-0"
        source={require("@/assets/images/pixels-saldo.png")}
        style={{ width: 145, height: 143 }}
        resizeMode="cover"
      />
    </View>
  );
}
