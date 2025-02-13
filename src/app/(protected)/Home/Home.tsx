import { useState } from "react";
import { View, Text } from "react-native";
import FormNovaTransacao from "../components/FormNovaTransacao";
import CardNovaTransacao from "../components/CardNovaTransacao";

export default function Home() {
  const [dados, setDados] = useState<any>([]);
  const [nome, setNome] = useState<string>();
  const [id, setId] = useState<any>();
  const [preco, setPreco] = useState<number>();

  return (
    <View className="flex-1 bg-fiap-light-green p-6">
      <CardNovaTransacao />
    </View>
  );
}
