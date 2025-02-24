"use client";

import { useState } from "react";
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

  return (
    <View className={`gap-1 w-full ${options.className ?? ""}`}>
      <InputLabel text={options.label} textBold={options.labelTextBold} />
      <TextInput
        className={`w-full bg-white rounded-lg border-[1px] p-3 ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
        keyboardType={getKeyboardType()}
        secureTextEntry={options.type === "password"}
        value={String(options.value ?? "")}
        placeholder={options.placeholder}
        onChangeText={handleValueChange}
      />
      {options.error && <Text className="text-red-500">{options.error}</Text>}
    </View>
  );
}
