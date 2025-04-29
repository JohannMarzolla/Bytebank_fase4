import { Image, Text, View } from "react-native";
import FormNovaTransacao from "./FormNovaTransacao";

export default function CardNovaTransacao() {
  return (
    <View className="relative items-center w-full bg-fiap-light-gray rounded-[8px] mb-10">
      <View className="w-full z-20 p-6">
        <Text className="text-xl font-bold pb-4">Nova transação</Text>
        <FormNovaTransacao />
      </View>

      <Image
        className="mb-6 mt-3 z-10"
        source={require("@/assets/images/nova-transacao-home.png")}
        style={{ width: 280, height: 230 }}
        resizeMode="cover"
      />

      <Image
        className="absolute top-0 right-0"
        source={require("@/assets/images/pixels-nova-transacao.png")}
        style={{ width: 145, height: 143 }}
        resizeMode="cover"
      />
      <Image
        className="absolute bottom-0 left-0"
        source={require("@/assets/images/pixels-nova-transacao.png")}
        style={{ width: 145, height: 143 }}
        resizeMode="cover"
      />
    </View>
  );
}
