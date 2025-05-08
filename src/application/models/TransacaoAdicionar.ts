import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";

export interface TransacaoAdicionar {
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Date;
  file?: any;
}
