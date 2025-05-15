import Input from "@/presentation/components/ui/Input";
import InputDate from "@/presentation/components/ui/InputDate";
import InputLabel from "@/presentation/components/ui/InputLabel";
import InputSelect from "@/presentation/components/ui/InputSelect";
import Button from "@/presentation/components/ui/Button";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { useTransacaoContext } from "@/presentation/contexts/TransacaoContext";
import { Transacao } from "@/domain/models/Transacao";
import { useState } from "react";
import { Text, View } from "react-native";
import { ListaTiposTransacao } from "@/shared/constants/tipos-transacao";
import { Loading } from "@/presentation/components/ui/Loading";

interface TransacaoEditarFormProps {
  transacao: Transacao;
  toDelete?: boolean;
  onSubmit?: () => void;
  onError?: () => void;
}

export default function TransacaoEditarForm({
  transacao,
  toDelete,
  onSubmit,
  onError,
}: TransacaoEditarFormProps) {
  const { update } = useTransacaoContext();
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
      if (onSubmit) onSubmit();

      if (formData.valor <= 0 || isNaN(formData.valor)) {
        setValorError("Campo obrigatório");
      } else {
        setValorError("");

        Loading.show();
        await update(formData);
        Loading.hide();
      }
    } catch (error: any) {
      if (onError) onError();
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
        readOnly={toDelete}
        value={formData.tipoTransacao}
        onValueChanged={(value) => handleChange("tipoTransacao", value)}
      />

      <Input
        type="number"
        label="Valor"
        style="dark"
        readOnly={toDelete}
        value={formData.valor.toString()}
        error={valorError}
        onValueChanged={(value) => handleChange("valor", Number(value))}
      />

      <InputDate
        label="Data"
        style="dark"
        readOnly={toDelete}
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

      {!toDelete && (
        <View className="pt-3">
          <Button text="Confirmar" color="green" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
}
