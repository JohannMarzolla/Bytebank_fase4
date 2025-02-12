import {  useState } from "react";
import { View, Text } from "react-native";


export default function Home() {
  const [dados, setDados] = useState<any>([]);
  const [nome, setNome] = useState<string>();
  const [id, setId] = useState<any>();
  const [preco, setPreco] = useState<number>();

 

  return (
    <View>
      <Text>Home</Text>
      <View>
        <Text>{id}</Text>
        <Text>{nome}</Text>
        <Text>{preco}</Text>
     
      </View>
    </View>
  );
}
