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

import FilePicker from "@/components/forms/FilePicker";
import { ListaTiposTransacao } from "@/app/types/TipoTransacao";

const FormNovaTransacao = () => {
  const { novaTransacao } = useTransacoes();
  const [addRunning, setAddRunning] = useState(false);
  const [formData, setFormData] = useState(new TransacaoAdicionar());
  const [errors, setErrors] = useState<TransacaoAdicionarErrors>({});
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData(new TransacaoAdicionar({ ...formData, [name]: value }));
  };

  const handleChangeFile = (value: any) => {
    setFileName(value?.name ?? "");
    setFormData(new TransacaoAdicionar({ ...formData, file: value }));
  };

  const processarTransacao = async () => {
    try {
      await novaTransacao(formData);
      setFileName("");
      setFormData(new TransacaoAdicionar());
    } catch (error: any) {
      ShowToast("error", error.message);
    }
  };

  const handleSubmit = async () => {
    if (!addRunning) {
      setAddRunning(true);

      const { isValid, errors } = formData.validate();
      setErrors(errors);

      if (isValid) await processarTransacao();
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
        maximumDate={new Date()}
        onValueChanged={(value) => handleChange("date", value)}
      />

      <FilePicker
        label="Anexo"
        style="dark"
        value={fileName}
        accept="image/*,application/pdf,.docx,.xlsx"
        onValueChanged={(value) => handleChangeFile(value)}
      />

      <Button text="Adicionar" color="blue" onPress={handleSubmit} />
    </View>
  );
};

export default FormNovaTransacao;
