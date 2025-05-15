import { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputLabel from "./InputLabel";
import { formatarData } from "@/shared/utils/formatarData";
import Icon from "./Icon";
import { colors } from "@/shared/constants/colors";
import IconButton from "./IconButton";

export interface InputDateOptions {
  /** Texto do label */
  label: string;
  /** Valor do input */
  value?: Date | null;
  /** Estilo */
  style?: "ligth" | "dark";
  /** Erro */
  error?: string;
  /** Especifica se o valor deve ser apenas leitura. */
  readOnly?: boolean;
  /** Especifica se deve ser mostrado o botão de limpar o valor. */
  showClearButton?: boolean;
  /** Classes css */
  className?: string;
  /** Data Máxima */
  maximumDate?: Date;
  /** Especifica se o texto do label deve ficar em negrito(bold). */
  labelTextBold?: boolean;
  /** Evento de alteração do valor. */
  onValueChanged?: (value: Date | null) => void;
}

export default function InputDate(options: InputDateOptions) {
  const [showPicker, setShowPicker] = useState(false);
  const style = options.style ?? "ligth";

  function onChange(event: any, selectedDate: any) {
    if (options.onValueChanged) options.onValueChanged(selectedDate);
    setShowPicker(false);
  }

  function getBorderStyle() {
    if (options.readOnly) return "border-fiap-gray";
    return style === "ligth"
      ? "border-fiap-light-blue"
      : "border-fiap-navy-blue";
  }

  function getTextStyle() {
    if (options.readOnly) return "text-fiap-gray";
    return options.value ? "text-black" : "text-gray-400";
  }

  return (
    <View className={`gap-1 w-full ${options.className ?? ""}`}>
      <InputLabel text={options.label} textBold={options.labelTextBold} />

      <View
        className={`w-full bg-white rounded-lg border-[1px] p-3 ${getBorderStyle()} flex-row justify-between items-center`}
      >
        <TouchableOpacity
          className="flex-1"
          disabled={options.readOnly}
          onPress={() => {
            if (!options.readOnly) setShowPicker(true);
          }}
        >
          <Text className={getTextStyle()}>
            {options.value ? formatarData(options.value) : "Selecionar data"}
          </Text>
        </TouchableOpacity>

        {options.showClearButton && options.value && !options.readOnly && (
          <IconButton
            onPress={() => onChange(null, null)}
            iconProps={{ name: "cancel", color: colors.fiap.gray, size: 22 }}
            style={{ padding: 0, marginVertical: -12 }}
          />
        )}
      </View>

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
