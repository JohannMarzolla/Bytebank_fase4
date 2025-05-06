import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";

export interface TransacaoAdicionarErrors {
  tipoTransacao?: string;
  valor?: string;
  date?: string;
}

export class TransacaoAdicionar {
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Date;
  file?: any;

  constructor(obj?: TransacaoAdicionar) {
    this.tipoTransacao = obj?.tipoTransacao ?? TipoTransacao.TRANSFERENCIA;
    this.valor = obj?.valor ?? 0;
    this.date = obj?.date ?? new Date();
    this.file = obj?.file;
  }

  validate = () => {
    const errors: TransacaoAdicionarErrors = {};
    let isValid = true;

    if (this.valor <= 0 || isNaN(this.valor)) {
      errors.valor = "Campo obrigatório";
      isValid = false;
    }

    return { isValid, errors };
  };
}
