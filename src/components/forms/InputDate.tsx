import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import InputLabel from "./InputLabel";

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
  /** Especifica se o texto do label deve ficar em negrito(bold). */
  labelTextBold?: boolean;
  /** Evento de alteração do valor. */
  onValueChanged?: (value: Date) => void;
}

export default function InputDate(options: InputDateOptions) {
  const [date, setDate] = useState(options.value ?? new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState("Selecionar data");
  const style = options.style ?? "ligth";

  function onChange(event: any, selectedDate: any) {
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(format(selectedDate, "dd/MM/yyyy"));
    }
    setShowPicker(false);
    if (options.onValueChanged) options.onValueChanged(selectedDate);
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
        <Text
          className={
            formattedDate === "Selecionar data" ? "text-gray-400" : "text-black"
          }
        >
          {formattedDate}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}

      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
