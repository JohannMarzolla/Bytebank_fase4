import validaEmail from "@/app/utils/validaEmail";
import { LoginFormErrors, LoginFormModel } from "./LoginFormModel";

export interface SignupFormErrors extends LoginFormErrors {
  // nome?: string;
  termoAceito?: string;
}

export class SignupFormModel extends LoginFormModel {
  // nome: string;
  termoAceito: boolean;

  constructor(obj?: SignupFormModel) {
    super(obj);
    // this.nome = obj?.nome ?? "";
    this.termoAceito = obj?.termoAceito ?? false;
  }

  validate = () => {
    const superResult = new LoginFormModel(this).validate();
    const errors: SignupFormErrors = superResult.errors;
    let isValid = superResult.isValid;

    if (this.password && this.password?.length < 6) {
      errors.password = "Precisa conter 6 ou mais caracteres";
      isValid = false;
    }

    // if (!this.nome) {
    //   errors.nome = "Nome é obrigatório";
    //   isValid = false;
    // }
    if (!this.termoAceito) {
      errors.termoAceito = "Necessário aceitar os termos";
      isValid = false;
    }

    return { isValid, errors };
  };
}
