import Input from "@/presentation/components/ui/Input";
import InputDate from "@/presentation/components/ui/InputDate";
import InputLabel from "@/presentation/components/ui/InputLabel";
import InputSelect from "@/presentation/components/ui/InputSelect";
import Button from "@/presentation/components/ui/Button";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { useTransacoes } from "@/presentation/contexts/TransacoesContext";
import { Transacao } from "@/domain/models/Transacao";
import { useState } from "react";
import { Text, View } from "react-native";
import { ListaTiposTransacao } from "@/shared/constants/tipos-transacao";
import { Loading } from "@/presentation/components/ui/Loading";

interface TransacaoEditarFormProps {
  transacao: Transacao;
  readOnly?: boolean;
}

export default function TransacaoEditarForm({
  transacao,
  readOnly,
}: TransacaoEditarFormProps) {
  const { update } = useTransacoes();
  const [formData, setFormData] = useState<Transacao>(transacao);
  const [valorError, setValorError] = useState<string>();

  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: name === "date" ? new Date(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.valor <= 0 || isNaN(formData.valor)) {
        setValorError("Campo obrigatório");
      } else {
        setValorError("");

        Loading.show();
        await update(formData);
        Loading.hide();
      }
    } catch (error: any) {
      ShowToast("error", error.message);
      Loading.hide();
    }
  };

  return (
    <View className="gap-4">
      <InputSelect
        label="Tipo"
        options={ListaTiposTransacao}
        style="dark"
        readOnly={readOnly}
        value={formData.tipoTransacao}
        onValueChanged={(value) => handleChange("tipoTransacao", value)}
      />

      <Input
        type="number"
        label="Valor"
        style="dark"
        readOnly={readOnly}
        value={formData.valor.toString()}
        error={valorError}
        onValueChanged={(value) => handleChange("valor", Number(value))}
      />

      <InputDate
        label="Data"
        style="dark"
        readOnly={readOnly}
        value={formData.date}
        maximumDate={new Date()}
        onValueChanged={(value) => handleChange("date", value)}
      />

      <View>
        <InputLabel text="Arquivo" />
        <Text className="text-gray-500 ">
          {transacao.fileName ?? "Sem arquivo"}
        </Text>
      </View>

      {!readOnly && (
        <View className="pt-3">
          <Button text="Confirmar" color="green" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
}
