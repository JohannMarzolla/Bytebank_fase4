import { Text } from "react-native";

export interface InputLabelOptions {
  /** Texto do label */
  text: string;
  /** Especifica se o texto do label deve ficar em negrito(bold). */
  textBold?: boolean;
}

export default function InputLabel(options: InputLabelOptions) {
  return (
    <Text
      className={`flex-shrink text-black ${
        options.textBold !== false ? "font-bold" : ""
      }`}
    >
      {options.text}
    </Text>
  );
}
