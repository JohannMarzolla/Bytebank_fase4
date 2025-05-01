import validaEmail from "@/shared/utils/validaEmail";

export type UserCadastroFields = "email" | "password" | "termoAceito";
export type UserCadastroErrors = Partial<Record<UserCadastroFields, string>>;

export class UserCadastroModel {
  email: string;
  password: string;
  termoAceito: boolean;

  constructor(obj?: UserCadastroModel) {
    this.email = obj?.email ?? "";
    this.password = obj?.password ?? "";
    this.termoAceito = obj?.termoAceito ?? false;
  }

  validate = () => {
    const errors: UserCadastroErrors = {};

    if (!this.password) {
      errors.password = "Campo obrigatório";
    } else if (this.password?.length < 6) {
      errors.password = "Precisa conter 6 ou mais caracteres";
    }

    if (!this.email) {
      errors.email = "Campo obrigatório";
    } else if (!validaEmail(this.email)) {
      errors.email = "Formato inválido";
    }

    if (!this.termoAceito) {
      errors.termoAceito = "Necessário aceitar os termos";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };
}
