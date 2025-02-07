export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export class LoginFormModel {
  email: string;
  password: string;

  constructor(obj?: LoginFormModel) {
    this.email = obj?.email || "";
    this.password = obj?.password || "";
  }

  validate = () => {
    const errors: LoginFormErrors = {};
    let isValid = true;

    if (!this.email) {
      errors.email = "Email é obrigatório";
      isValid = false;
    } else if (!validaEmail(this.email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    if (!this.password) {
      errors.password = "Password é obrigatório";
      isValid = false;
    }

    return { isValid, errors };
  };
}

function validaEmail(email: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}
