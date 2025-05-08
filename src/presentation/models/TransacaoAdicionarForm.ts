import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";

export type TransacaoAdicionarFormFields = "tipoTransacao" | "valor" | "date";
export type TransacaoAdicionarFormErrors = Partial<
  Record<TransacaoAdicionarFormFields, string>
>;

export class TransacaoAdicionarForm {
  tipoTransacao: TipoTransacao;
  valor: number;
  date: Date;
  file?: any;

  constructor(obj?: TransacaoAdicionarForm) {
    this.tipoTransacao = obj?.tipoTransacao ?? TipoTransacao.TRANSFERENCIA;
    this.valor = obj?.valor ?? 0;
    this.date = obj?.date ?? new Date();
    this.file = obj?.file;
  }

  validate = () => {
    const errors: TransacaoAdicionarFormErrors = {};
    let isValid = true;

    if (this.valor <= 0 || isNaN(this.valor)) {
      errors.valor = "Campo obrigatório";
      isValid = false;
    }

    return { isValid, errors };
  };
}
