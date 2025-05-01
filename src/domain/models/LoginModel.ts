import validaEmail from "@/shared/utils/validaEmail";

export type LoginFields = "email" | "password";
export type LoginErrors = Partial<Record<LoginFields, string>>;

export class LoginModel {
  email: string;
  password: string;

  constructor(obj?: LoginModel) {
    this.email = obj?.email ?? "";
    this.password = obj?.password ?? "";
  }

  validate = () => {
    const errors: LoginErrors = {};

    if (!this.email) {
      errors.email = "Campo obrigatório";
    } else if (!validaEmail(this.email)) {
      errors.email = "Formato inválido";
    }

    if (!this.password) {
      errors.password = "Campo obrigatório";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };
}
