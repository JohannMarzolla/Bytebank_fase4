import {  useState } from "react";
import { View, Text } from "react-native";
import FormNovaTransacao from "../components/FormNovaTransacao";


export default function Home() {
  const [dados, setDados] = useState<any>([]);
  const [nome, setNome] = useState<string>();
  const [id, setId] = useState<any>();
  const [preco, setPreco] = useState<number>();

 

  return (
    <View>
      <Text>Home</Text>
      <FormNovaTransacao/>
    </View>
  );
}
