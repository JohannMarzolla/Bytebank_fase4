import { InputSelectOption } from "@/components/forms/InputSelect";

export enum TipoTransacao {
  DEPOSITO = "deposito",
  TRANSFERENCIA = "transferencia",
}

export const ListaTiposTransacao: InputSelectOption[] = [
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];

export const ListaTiposTransacaoInputSelect: InputSelectOption[] = [
  { value: "Todos", label: "Todos" },
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];
