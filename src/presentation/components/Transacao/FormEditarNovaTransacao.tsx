import { ListaTiposTransacao } from "@/shared/types/TipoTransacao";
import Input from "@/presentation/components/ui/Input";
import InputDate from "@/presentation/components/ui/InputDate";
import InputLabel from "@/presentation/components/ui/InputLabel";
import InputSelect from "@/presentation/components/ui/InputSelect";
import Button from "@/presentation/components/ui/Button";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { useTransacoes } from "@/presentation/contexts/TransacoesContext";
import { Transacao } from "@/domain/models/Transacao";
import { TransacaoAdicionarErrors } from "@/domain/models/TransacaoAdicionar";
import { useState } from "react";
import { Text, View } from "react-native";

interface FormEditarTransacaoProps {
  transacao: Transacao;
}

export default function FormEditarTransacao({
  transacao,
}: FormEditarTransacaoProps) {
  const { atualizarTransacao } = useTransacoes();

  const [formData, setFormData] = useState<Transacao>({
    id: transacao.id,
    tipoTransacao: transacao.tipoTransacao,
    valor: transacao.valor,
    date: transacao.date ? transacao.date : new Date(),
    fileName: transacao.fileName,
  });

  const [errors, setErrors] = useState<TransacaoAdicionarErrors>({});

  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: name === "date" ? new Date(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await atualizarTransacao(formData);
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
        maximumDate={new Date()}
        onValueChanged={(value) => handleChange("date", value)}
      />

      <View>
        <InputLabel text="Arquivo" />
        <Text className="text-gray-500 ">
          {transacao.fileName ?? "Sem arquivo"}
        </Text>
      </View>

      <Button text="Confirmar" color="green" onPress={handleSubmit} />
    </View>
  );
}
