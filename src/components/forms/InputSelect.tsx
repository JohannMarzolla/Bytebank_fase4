import { Picker } from "@react-native-picker/picker";
import InputLabel from "./InputLabel";

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
    <div className="flex flex-col gap-1 w-full">
      <InputLabel text={options.label} />

      <Picker
        className={`input w-full border-[1px] ${
          style === "ligth" ? "border-fiap-light-blue" : "border-fiap-navy-blue"
        }`}
        selectedValue={options.value}
        onValueChange={onValueChanged}
      >
        {options.options?.length &&
          options.options.map((option) => (
            <Picker.Item label={option.label} value={option.value} />
          ))}
      </Picker>

      {options.error && <span className="text-red-500">{options.error}</span>}
    </div>
  );
}
