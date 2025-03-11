import { Picker } from "@react-native-picker/picker";
import InputLabel from "./InputLabel";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

export interface InputSelectOption {
  /** Valor da opção, utilizado para identificar o valor selecionado. */
  value: any;
  /** Texto exibido para o usuário */
  label: string;
}

export interface InputSelectOptions {
  /** Texto do label */
  label?: string;
  /** Placeholder */
  placeholder?: string;
  /** Valor da opção selecionada */
  value?: any;
  /** Erro */
  error?: string;
  /** Opções disponíveis */
  options?: InputSelectOption[];
  /** Estilo */
  style?: "ligth" | "dark";
  /** Evento de alteração do valor. */
  onValueChanged?: (value: any) => void;
}

export default function InputSelect(options: InputSelectOptions) {
  const style = options.style ?? "ligth";

  function onValueChanged(value: any) {
    if (options.onValueChanged) options.onValueChanged(value);
  }

  return (
    <View className="gap-1 w-full">
      {options.label && <InputLabel text={options.label} />}

      <View
        className={`bg-white justify-center w-full h-12 overflow-hidden rounded-lg border-[1px] ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
      >
        <Picker
          selectedValue={options.value}
          placeholder={options.placeholder}
          onValueChange={onValueChanged}
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
