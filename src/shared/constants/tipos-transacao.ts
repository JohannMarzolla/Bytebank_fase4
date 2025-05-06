import { InputSelectOption } from "@/presentation/components/ui/InputSelect";
import { TipoTransacao } from "../types/TipoTransacaoEnum";

export const ListaTiposTransacao: InputSelectOption[] = [
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];

export const ListaTiposTransacaoInputSelect: InputSelectOption[] = [
  { value: "Todos", label: "Todos" },
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];
