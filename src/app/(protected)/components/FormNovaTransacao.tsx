import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import { useTransacoes } from "@/context/TransacoesContext";
import Button from "@/components/ui/Button";
import Input from "@/components/forms/Input";
import InputDate from "@/components/forms/InputDate";
import InputSelect from "@/components/forms/InputSelect";
import { ShowToast } from "@/components/ui/Toast";
import {
  TransacaoAdicionar,
  TransacaoAdicionarErrors,
} from "@/models/TransacaoAdicionar";
import { ListaTiposTransacao } from "@/app/types/TipoTransacao";

const FormNovaTransacao = () => {
  const { userId } = useAuth();
  const { novaTransacao } = useTransacoes();
  const [loginRunning, setLoginRunning] = useState(false);
  const [formData, setFormData] = useState(new TransacaoAdicionar());
  const [errors, setErrors] = useState<TransacaoAdicionarErrors>({});

  const handleChange = (name: string, value: any) => {
    setFormData(new TransacaoAdicionar({ ...formData, [name]: value }));
  };

  const processarTransacao = async () => {
    try {
      await novaTransacao(formData);
    } catch (error: any) {
      ShowToast("error", error.message);
    }
  };

  const handleSubmit = () => {
    if (!loginRunning) {
      setLoginRunning(true);

      const { isValid, errors } = formData.validate();
      setErrors(errors);

      if (isValid) {
        processarTransacao();
        setFormData(new TransacaoAdicionar());
      }
      setLoginRunning(false);
    }
  };

  return (
    <View className="gap-4">
      <InputSelect
        label="Tipo"
        options={ListaTiposTransacao}
        style="dark"
        value={formData.tipoTransacao}
        error={errors.tipoTransacao}
        onValueChanged={(value) => handleChange("tipoTransacao", value)}
      />

      <Input
        type="number"
        label="Valor"
        style="dark"
        value={formData.valor}
        error={errors.valor}
        onValueChanged={(value) => handleChange("valor", value)}
      />

      <InputDate
        label="Data"
        style="dark"
        value={formData.date}
        error={errors.date}
        onValueChanged={(value) => handleChange("date", value)}
      />

      <Button text="Adicionar transação" color="blue" onPress={handleSubmit} />
    </View>
  );
};

export default FormNovaTransacao;
