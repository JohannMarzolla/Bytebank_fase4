import InputLabel from "./InputLabel";
import { KeyboardType, TextInput, View, Text } from "react-native";

export interface InputOptions {
  /** Texto do label */
  label: string;
  /** Tipo de input */
  type?: "string" | "number" | "email" | "password";
  /** Valor do input */
  value?: string | number;
  /** Placeholder */
  placeholder?: string;
  /** Estilo */
  style?: "ligth" | "dark";
  /** Erro */
  error?: string;
  /** Especifica se o valor deve ser apenas leitura. */
  readOnly?: boolean;
  /** Classes css */
  className?: string;
  /** Especifica se o texto do label deve ficar em negrito(bold). */
  labelTextBold?: boolean;
  /** Evento de alteração do valor. */
  onValueChanged?: (value: string | number) => void;
}

export default function Input(options: InputOptions) {
  const style = options.style ?? "ligth";

  function handleValueChange(value: string) {
    let formatedValue: string | number = value;

    if (options.type === "number") {
      const number = Number.parseInt(value);
      formatedValue = isNaN(number) ? 0 : number;
    }

    if (options.onValueChanged) options.onValueChanged(formatedValue);
  }

  function getKeyboardType(): KeyboardType {
    switch (options.type) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      default:
        return "default";
    }
  }

  function getReadonlyStyle() {
    return options.readOnly ? "border-fiap-gray text-fiap-gray" : "";
  }

  return (
    <View className={`gap-1 w-full ${options.className ?? ""}`}>
      <InputLabel text={options.label} textBold={options.labelTextBold} />
      <TextInput
        className={`w-full bg-white rounded-lg border-[1px] p-3 ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        } ${getReadonlyStyle()}`}
        keyboardType={getKeyboardType()}
        secureTextEntry={options.type === "password"}
        value={String(options.value ?? "")}
        placeholder={options.placeholder}
        readOnly={options.readOnly}
        onChangeText={handleValueChange}
      />
      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
