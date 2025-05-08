import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";

export interface TransacaoDTO {
  tipoTransacao: TipoTransacao;
  valor: number;
  date: string; // ISO
  file?: string | null; // URL
  fileName?: string | null;
}
