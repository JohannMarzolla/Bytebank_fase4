import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TipoTransacao } from "../../types/tipoTransacao";
import { useAuth } from "@/context/AuthContext";
import { useTransacoes } from "@/context/TransacoesContext";

const FormNovaTransacao = () => {
  const { userId } = useAuth();
  const { deposito, transferencia, novaTransacao } = useTransacoes();

  const [formData, setFormData] = useState({
    tipoTransacao: "deposito",
    valor: "",
    date: new Date().toISOString(),
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const processarTransacao = () => {
    const { tipoTransacao, valor, date } = formData;
    const valorNumerico = parseFloat(valor);

    novaTransacao(tipoTransacao, valorNumerico, date, userId);

    if (tipoTransacao === TipoTransacao.DEPOSITO) {
      deposito(valorNumerico);
    } else if (tipoTransacao === TipoTransacao.TRANSFERENCIA) {
      transferencia(valorNumerico);
    } else {
      Alert.alert("Erro", "Tipo de Transação é inválido!");
    }
  };

  const isFormValid = () => {
    const { tipoTransacao, valor, date } = formData;
    const valorNumerico = parseFloat(valor);

    if (!tipoTransacao || tipoTransacao.trim() === "") return false;
    if (valorNumerico <= 0 || isNaN(valorNumerico)) return false;
    if (!date || isNaN(new Date(date).getTime())) return false;

    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert("Erro", "Dados inválidos!");
      return;
    }
    processarTransacao();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      tipoTransacao: "deposito",
      valor: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <View>
      <Text>Tipo</Text>
      <Picker
        selectedValue={formData.tipoTransacao}
        onValueChange={(value) => handleChange("tipoTransacao", value)}
      >
        <Picker.Item label="Selecione o Tipo" value="" />
        <Picker.Item label="Transferência" value="transferencia" />
        <Picker.Item label="Depósito" value="deposito" />
      </Picker>

      <Text>Valor</Text>
      <TextInput
        keyboardType="numeric"
        value={formData.valor}
        onChangeText={(value) => handleChange("valor", value)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Data</Text>
      <TextInput
        value={formData.date}
        onChangeText={(value) => handleChange("date", value)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Adicionar Transação" onPress={handleSubmit} color="blue" />
    </View>
  );
};

export default FormNovaTransacao;
