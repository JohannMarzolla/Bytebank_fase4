import validaEmail from "@/app/utils/validaEmail";

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export class LoginFormModel {
  email: string;
  password: string;

  constructor(obj?: LoginFormModel) {
    this.email = obj?.email ?? "";
    this.password = obj?.password ?? "";
  }

  validate = () => {
    const errors: LoginFormErrors = {};
    let isValid = true;

    if (!this.email) {
      errors.email = "Campo obrigatório";
      isValid = false;
    } else if (!validaEmail(this.email)) {
      errors.email = "Formato inválido";
      isValid = false;
    }

    if (!this.password) {
      errors.password = "Campo obrigatório";
      isValid = false;
    }

    return { isValid, errors };
  };
}
