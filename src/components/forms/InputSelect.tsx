import { Picker } from "@react-native-picker/picker";
import InputLabel from "./InputLabel";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "@/constants/Colors";

export interface InputSelectOption {
  /** Valor da opção, utilizado para identificar o valor selecionado. */
  value: string;
  /** Texto exibido para o usuário */
  label: string;
}

export interface InputSelectOptions {
  /** Texto do label */
  label: string;
  /** Valor da opção selecionada */
  value?: string | number;
  /** Erro */
  error?: string;
  /** Opções disponíveis */
  options?: InputSelectOption[];
  /** Estilo */
  style?: "ligth" | "dark";
  /** Evento de alteração do valor. */
  onValueChanged?: (value: string | number) => void;
}

export default function InputSelect(options: InputSelectOptions) {
  const style = options.style ?? "ligth";

  function onValueChanged(value: string | number) {
    if (options.onValueChanged) options.onValueChanged(value);
  }

  return (
//     <View className="gap-1 w-full">
//       <InputLabel text={options.label} />

//       <View
//         className={`flex-1 justify-center w-full h-12 overflow-hidden rounded-lg border-[1px] ${
//           style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
//         }`}
//       >
//         <Picker
//           selectedValue={options.value}
//           onValueChange={onValueChanged}
//           style={{ height: 48, backgroundColor: colors.fiap.white, borderWidth: 1, borderColor: style === "ligth" ? colors.fiap["light-blue"] : colors.fiap["light-blue"] }}
//           itemStyle={{ fontSize: 16, color: "black" }} 
//         >
//           {options.options?.length &&
//             options.options.map((option) => (
//               <Picker.Item
//                 key={option.value}
//                 label={option.label}
//                 value={option.value}
//               />
//             ))}
//         </Picker>
//       </View>

//       {options.error && <Text className="text-red-500">{options.error}</Text>}
//     </View>
//   );
// }

// MUDANÇA DE ESTILO PROVISORIA AFIM DE APAREER O PIKCER NO INPUT SELECT DE TRANSAÇOES  

<View style={styles.container}>
<InputLabel text={options.label} />

<View
  style={[
    styles.pickerContainer,
    style === "ligth" ? styles.lightBorder : styles.darkBorder,
  ]}
>
  <Picker
    selectedValue={options.value}
    onValueChange={onValueChanged}
    style={styles.picker}
    itemStyle={styles.pickerItem}
  >
    {options.options?.map((option) => (
      <Picker.Item
        key={option.value}
        label={option.label}
        value={option.value}
      />
    ))}
  </Picker>
</View>

{options.error && <Text style={styles.errorText}>{options.error}</Text>}
</View>
);
}

const styles = StyleSheet.create({
container: {
gap: 4,
width: "100%",
},
pickerContainer: {
justifyContent: "center",
width: "100%",
height: 48, // Altura fixa do contêiner do Picker
overflow: "hidden",
borderRadius: 8,
borderWidth: 1,
backgroundColor: colors.fiap.white,
},
lightBorder: {
borderColor: colors.fiap["navy-blue"],
},
darkBorder: {
borderColor: colors.fiap["navy-blue"],
},
picker: {
height: 48, // Altura fixa do Picker
paddingHorizontal: 10,
color: "black", // Cor do texto selecionado
},
pickerItem: {
fontSize: 16,
color: "black", // Cor dos itens da lista
},
errorText: {
color: "red",
fontSize: 14,
},
});
