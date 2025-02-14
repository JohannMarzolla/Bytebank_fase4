import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TipoTransacao } from "../../types/tipoTransacao";
import { useAuth } from "@/context/AuthContext";
import { useTransacoes } from "@/context/TransacoesContext";
import Button from "@/components/ui/Button";
import Input from "@/components/forms/Input";
import InputDate from "@/components/forms/InputDate";

const FormNovaTransacao = () => {
  const { userId } = useAuth();
  const { deposito, transferencia, novaTransacao } = useTransacoes();

  const [formData, setFormData] = useState({
    tipoTransacao: "deposito",
    valor: 0,
    date: new Date(),
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const processarTransacao = () => {
    const { tipoTransacao, valor, date } = formData;
    novaTransacao(tipoTransacao, valor, date.toISOString(), userId);

    if (tipoTransacao === TipoTransacao.DEPOSITO) {
      deposito(valor);
    } else if (tipoTransacao === TipoTransacao.TRANSFERENCIA) {
      transferencia(valor);
    } else {
      Alert.alert("Erro", "Tipo de Transação é inválido!");
    }
  };

  const isFormValid = () => {
    const { tipoTransacao, valor, date } = formData;

    if (!tipoTransacao || tipoTransacao.trim() === "") return false;
    if (valor <= 0 || isNaN(valor)) return false;
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
      valor: 0,
      date: new Date(),
    });
  };

  return (
    <View className="gap-4">
      <Text>Tipo</Text>
      <Picker
        selectedValue={formData.tipoTransacao}
        onValueChange={(value) => handleChange("tipoTransacao", value)}
      >
        <Picker.Item label="Selecione o Tipo" value="" />
        <Picker.Item label="Transferência" value="transferencia" />
        <Picker.Item label="Depósito" value="deposito" />
      </Picker>

      <Input
        type="number"
        label="Valor"
        style="dark"
        value={formData.valor}
        onValueChanged={(value) => handleChange("valor", value)}
      />

      <InputDate
        label="Data"
        style="dark"
        value={formData.date}
        onValueChanged={(value) => handleChange("valor", value)}
      />

      <Button text="Adicionar transação" color="blue" onPress={handleSubmit} />
    </View>
  );
};

export default FormNovaTransacao;
