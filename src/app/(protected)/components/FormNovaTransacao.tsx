import React, { useState } from "react";
import { View } from "react-native";
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
  const { novaTransacao } = useTransacoes();
  const [addRunning, setAddRunning] = useState(false);
  const [formData, setFormData] = useState(new TransacaoAdicionar());
  const [errors, setErrors] = useState<TransacaoAdicionarErrors>({});

  const handleChange = (name: string, value: any) => {
    setFormData(new TransacaoAdicionar({ ...formData, [name]: value }));
  };

  const processarTransacao = async () => {
    try {
      console.log('form data procesar transacao', formData)
      await novaTransacao(formData);
    } catch (error: any) {
      ShowToast("error", error.message);
    }
  };

  const handleSubmit = () => {
    if (!addRunning) {
      setAddRunning(true);

      const { isValid, errors } = formData.validate();
      setErrors(errors);

      if (isValid) {
        processarTransacao();
        setFormData(new TransacaoAdicionar());
      }
      setAddRunning(false);
    }
  };

  return (
    <View className="gap-4 items-center">
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

      <Button text="Adicionar" color="blue" onPress={handleSubmit} />
    </View>
  );
};

export default FormNovaTransacao;
