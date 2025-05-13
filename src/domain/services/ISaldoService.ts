export interface ISaldoService {
  get(userId: string): Promise<number | null>;
  update(userId: string, novoSaldo: number): Promise<boolean>;
  deposito(userId: string, valor: number): Promise<void>;
  transferencia(userId: string, valor: number): Promise<number>;
  verificaSaldo(userId: string, valor: number): Promise<boolean>;
}