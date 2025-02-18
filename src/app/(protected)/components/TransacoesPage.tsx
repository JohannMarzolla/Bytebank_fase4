import React from "react";
import { View, Text } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/forms/Input";
import ListaTransacoes from "./ListaTransacoes";
import { useTransacoes } from "@/context/TransacoesContext";

export default function TransacoesPage() {
    const { transacoes } = useTransacoes();

    return (
        <View className="bg-fiap-white shadow-md rounded-lg p-6 w-126">
            <View className="flex flex-row items-center justify-between mb-4">
                <Text className="font-bold text-lg">Transferências</Text>
            </View>

            <View className="flex flex-col bg-white border-[1px] rounded border-fiap-light-blue px-4 pt-3 pb-5">
                <Text className="pb-3">Filtros</Text>

                <View className="flex flex-row max-sm:flex-col gap-2 mb-4">
                    <Button text="Todos" color="blue" />
                    <Button text="Depósitos" color="blue" />
                    <Button text="Transferências" color="blue" />
                </View>

                <View className="flex flex-row max-sm:flex-col w-full gap-4">
                    <Input
                        type="date"
                        label="Data início:"
                        labelTextBold={false}
                        name="dataInicio"
                    />
                    <Input
                        type="date"
                        label="Data fim:"
                        labelTextBold={false}
                        name="dataFim"
                    />
                </View>
            </View>

            <ListaTransacoes transacoes={transacoes} />
        </View>
    );
}
