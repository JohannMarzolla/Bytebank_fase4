import React, { useState } from "react";
import { View } from "react-native";
import { useTransacoes } from "@/application/contexts/TransacoesContext";
import Button from "@/presentation/components/ui/Button";
import Input from "@/presentation/components/ui/Input";
import InputDate from "@/presentation/components/ui/InputDate";
import InputSelect from "@/presentation/components/ui/InputSelect";
import { ShowToast } from "@/presentation/components/ui/Toast";
import {
  TransacaoAdicionar,
  TransacaoAdicionarErrors,
} from "@/domain/models/TransacaoAdicionar";
import FilePicker from "@/presentation/components/ui/FilePicker";
import { ListaTiposTransacao } from "@/shared/constants/tipos-transacao";
import { Loading } from "@/presentation/components/ui/Loading";

export default function TransacaoCriarForm() {
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
      Loading.show();
      await novaTransacao(formData);
      setFileName("");
      setFormData(new TransacaoAdicionar());
      Loading.hide();
    } catch (error: any) {
      ShowToast("error", error.message);
      Loading.hide();
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
}
