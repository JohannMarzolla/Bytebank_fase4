import { InputSelectOption } from "@/components/forms/InputSelect";

export enum TipoTransacao {
  DEPOSITO = "deposito",
  TRANSFERENCIA = "transferencia",
}

export const ListaTiposTransacao: InputSelectOption[] = [
  { value: "", label: "Selecione o Tipo" },
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];
