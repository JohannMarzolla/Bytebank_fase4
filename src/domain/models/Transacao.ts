import { TipoTransacao } from "@/shared/types/TipoTransacao";

export interface Transacao {
  id: string;
  userId?: string;
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Date;
  fileName?: string;
}
