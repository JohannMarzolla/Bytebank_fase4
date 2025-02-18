import { TipoTransacao } from "@/app/types/TipoTransacao";

export interface Transacao {
  transacaoId?: string;
  userId?: string;
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Date;
}

