import { Picker } from "@react-native-picker/picker";
import InputLabel from "./InputLabel";
import { Text, View } from "react-native";
import { colors } from "@/constants/Colors";

export interface InputSelectOption {
  /** Valor da opção, utilizado para identificar o valor selecionado. */
  value: string;
  /** Texto exibido para o usuário */
  label: string;
}

export interface InputSelectOptions {
  /** Texto do label */
  label: string;
  /** Valor da opção selecionada */
  value?: string | number;
  /** Erro */
  error?: string;
  /** Opções disponíveis */
  options?: InputSelectOption[];
  /** Estilo */
  style?: "ligth" | "dark";
  /** Evento de alteração do valor. */
  onValueChanged?: (value: string | number) => void;
}

export default function InputSelect(options: InputSelectOptions) {
  const style = options.style ?? "ligth";

  function onValueChanged(value: string | number) {
    if (options.onValueChanged) options.onValueChanged(value);
  }

  return (
    <View className="gap-1 w-full">
      <InputLabel text={options.label} />

      <View
        className={`flex-1 justify-center w-full h-12 overflow-hidden rounded-lg border-[1px] ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
      >
        <Picker
          selectedValue={options.value}
          onValueChange={onValueChanged}
          style={{ backgroundColor: colors.fiap.white }}
          itemStyle={{}}
        >
          {options.options?.length &&
            options.options.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
        </Picker>
      </View>

      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
