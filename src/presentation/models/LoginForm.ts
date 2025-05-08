import validaEmail from "@/shared/utils/validaEmail";

export type LoginFormFields = "email" | "password";
export type LoginFormErrors = Partial<Record<LoginFormFields, string>>;

export class LoginForm {
  email: string;
  password: string;

  constructor(obj?: LoginForm) {
    this.email = obj?.email ?? "";
    this.password = obj?.password ?? "";
  }

  validate = () => {
    const errors: LoginFormErrors = {};

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
