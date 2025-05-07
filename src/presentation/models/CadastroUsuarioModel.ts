import validaEmail from "@/shared/utils/validaEmail";

export type CadastroUsuarioFields = "email" | "password" | "termoAceito";
export type CadastroUsuarioErrors = Partial<
  Record<CadastroUsuarioFields, string>
>;

export class CadastroUsuarioModel {
  email: string;
  password: string;
  termoAceito: boolean;

  constructor(obj?: CadastroUsuarioModel) {
    this.email = obj?.email ?? "";
    this.password = obj?.password ?? "";
    this.termoAceito = obj?.termoAceito ?? false;
  }

  validate = () => {
    const errors: CadastroUsuarioErrors = {};

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
