import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputLabel from "./InputLabel";
import { formatarData } from "@/app/utils/FormatarData";

export interface InputDateOptions {
  /** Texto do label */
  label: string;
  /** Valor do input */
  value?: Date;
  /** Estilo */
  style?: "ligth" | "dark";
  /** Erro */
  error?: string;
  /** Classes css */
  className?: string;
  /** Data Máxima */
  maximumDate?: Date;
  /** Especifica se o texto do label deve ficar em negrito(bold). */
  labelTextBold?: boolean;
  /** Evento de alteração do valor. */
  onValueChanged?: (value: Date) => void;
}

export default function InputDate(options: InputDateOptions) {
  const [showPicker, setShowPicker] = useState(false);
  const style = options.style ?? "ligth";

  function onChange(event: any, selectedDate: any) {
    if (options.onValueChanged) options.onValueChanged(selectedDate);
    setShowPicker(false);
  }

  return (
    <View className={`gap-1 w-full ${options.className ?? ""}`}>
      <InputLabel text={options.label} textBold={options.labelTextBold} />

      <TouchableOpacity
        className={`w-full bg-white rounded-lg border-[1px] p-3 ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
        onPress={() => setShowPicker(true)}
      >
        <Text className={options.value ? "text-black" : "text-gray-400"}>
          {options.value ? formatarData(options.value) : "Selecionar data"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={options.value ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={options.maximumDate}
          onChange={onChange}
        />
      )}

      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
