import { TipoTransacao } from "../types/TipoTransacaoEnum";
import { TransacaoFiltroTipoEnum } from "../types/TransacaoFiltroTipoEnum";
import { SelectOption } from "../models/SelectOption";

export const ListaTiposTransacao: SelectOption[] = [
  { value: TipoTransacao.TRANSFERENCIA, label: "Transferência" },
  { value: TipoTransacao.DEPOSITO, label: "Depósito" },
];

export const ListaTiposTransacaoFiltro: SelectOption[] = [
  { value: TransacaoFiltroTipoEnum.TODOS, label: "Todos" },
  { value: TransacaoFiltroTipoEnum.TRANSFERENCIA, label: "Transferência" },
  { value: TransacaoFiltroTipoEnum.DEPOSITO, label: "Depósito" },
];
