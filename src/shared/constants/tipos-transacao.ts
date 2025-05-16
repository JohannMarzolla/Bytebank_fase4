import { InputSelectOption } from "@/presentation/components/ui/InputSelect";
import { TipoTransacao } from "../types/TipoTransacaoEnum";
import { TransacaoFiltroTipoEnum } from "../types/TransacaoFiltroTipoEnum";

export const ListaTiposTransacao: InputSelectOption[] = [
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];

export const ListaTiposTransacaoInputSelect: InputSelectOption[] = [
  { value: TransacaoFiltroTipoEnum.TODOS, label: "Todos" },
  { value: TransacaoFiltroTipoEnum.TRANSFERENCIA, label: "Transferência" },
  { value: TransacaoFiltroTipoEnum.DEPOSITO, label: "Depósito" },
];
