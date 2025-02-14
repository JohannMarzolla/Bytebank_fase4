import { useState } from "react";
import { ScrollView, View } from "react-native";
import CardNovaTransacao from "../components/CardNovaTransacao";
import Saldo from "../components/Saldo";

export default function Home() {

  return (
    <ScrollView className="flex-1 bg-fiap-light-green p-6">
      <Saldo/>
      <CardNovaTransacao />
    </ScrollView>
  );
}
