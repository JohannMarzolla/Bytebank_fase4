import { useState } from "react";
import InputLabel from "./InputLabel";
import { View, Text, Pressable } from "react-native";

export interface InputCheckboxOptions {
  /** Texto do label */
  label: string;
  /** Valor do input */
  value?: boolean;
  /** Erro */
  error?: string;
  /** Classes css */
  className?: string;
  /** Evento de alteração do valor. */
  onValueChanged?: (value: boolean) => void;
}

export default function InputCheckbox(options: InputCheckboxOptions) {
  const [checked, setChecked] = useState(options.value ?? false);

  function onValueChanged() {
    const newValue = !checked;
    setChecked(newValue);
    if (options.onValueChanged) options.onValueChanged(newValue);
  }

  return (
    <View className={`${options.className ?? ""}`}>
      <View className="flex-row items-center gap-3">
        <Pressable
          className={`w-6 h-6 border-2 rounded items-center ${
            checked ? "bg-fiap-green border-fiap-green" : "border-gray-400"
          }`}
          onPress={() => onValueChanged()}
        >
          {checked && <Text className="text-white font-bold">✓</Text>}
        </Pressable>

        <InputLabel text={options.label} textBold={false} />
      </View>

      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
