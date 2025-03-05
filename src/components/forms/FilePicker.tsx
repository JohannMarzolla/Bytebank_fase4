import React, { useState } from "react";
import { View, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import InputLabel from "./InputLabel";

export interface FilePickerOptions {
  /** Texto do label */
  label: string;
  /** Valor do input */
  value?: any;
  /** Estilo */
  style?: "ligth" | "dark";
  /** Erro */
  error?: string;
  /** Formatos aceitos */
  accept?: string;
  /** Especifica se o texto do label deve ficar em negrito(bold). */
  labelTextBold?: boolean;
  /** Evento de alteração do valor. */
  onValueChanged?: (value: any) => void;
}

export default function FilePicker(options: FilePickerOptions) {
  const [fileName, setFileName] = useState<string | null>(null);
  const style = options.style ?? "ligth";

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.canceled) return;

      setFileName(result.assets[0].name);
      if (options.onValueChanged) options.onValueChanged(result.assets[0]);
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
    }
  };

  return (
    <View className="gap-1 w-full">
      <InputLabel text={options.label} textBold={options.labelTextBold} />
      <Text
        onPress={pickDocument}
        className={`w-full bg-white rounded-lg border-[1px] p-3 ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
      >
        {fileName ?? "Selecionar arquivo"}
      </Text>

      {options.error && <span className="text-red-500">{options.error}</span>}
    </View>
  );
}
