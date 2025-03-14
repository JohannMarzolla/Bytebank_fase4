import { ListaTiposTransacao } from "@/app/types/TipoTransacao";
import Input from "@/components/forms/Input";
import InputDate from "@/components/forms/InputDate";
import InputSelect from "@/components/forms/InputSelect";
import Button from "@/components/ui/Button";
import { ShowToast } from "@/components/ui/Toast";
import { useTransacoes } from "@/context/TransacoesContext";
import { Transacao } from "@/models/Transacao";
import {
  TransacaoAdicionarErrors,
} from "@/models/TransacaoAdicionar";
import { useState } from "react";
import { View } from "react-native";

interface FormEditarTransacaoProps {
  transacao: Transacao;
}

export default function FormEditarTransacao({
  transacao,
}: FormEditarTransacaoProps) {
  const { atualizarTransacao } = useTransacoes();

  const [formData, setFormData] = useState({
    id: transacao.id,
    tipoTransacao: transacao.tipoTransacao,
    valor: transacao.valor,
    date: transacao.date ? new Date(transacao.date) : new Date(),
  });

  const [errors, setErrors] = useState<TransacaoAdicionarErrors>({});

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: name === "date" ? new Date(value) : value });
  };

  const handleSubmit = async () => {
    try {
      await atualizarTransacao(formData);
      ShowToast("success", "Transação atualizada com sucesso!");
    } catch (error: any) {
      ShowToast("error", error.message);
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
        value={formData.valor.toString()}
        error={errors.valor}
        onValueChanged={(value) => handleChange("valor", Number(value))}
      />

      <InputDate
        label="Data"
        style="dark"
        value={formData.date}
        error={errors.date}
        onValueChanged={(value) => handleChange("date", value)}
      />

      <Button text="Confirmar" color="green" onPress={handleSubmit} />
    </View>
  );
}
