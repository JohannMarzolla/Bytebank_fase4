import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import DatePicker from "react-native-date-picker";
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
  const [open, setOpen] = useState(false);
  const style = options.style ?? "ligth";

  return (
    <View
      className={`flex flex-col gap-1 w-full h-full ${options.className ?? ""}`}
    >
      <Text className="text-xl mb-4">
        Data selecionada: {date.toLocaleDateString()}
      </Text>
      <Button title="Selecionar Data" onPress={() => setOpen(true)} />

      <InputLabel text={options.label} textBold={options.labelTextBold} />

      <DatePicker
        className={`input bg-white w-full border-[1px] ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
        modal
        open={open}
        date={date}
        onConfirm={(selectedDate) => {
          setOpen(false);
          setDate(selectedDate);
        }}
        onCancel={() => setOpen(false)}
      />

      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
