export interface ISaldoRepository {
  get(userId: string): Promise<number | null>;
  update(userId: string, novoSaldo: number): Promise<boolean>;
}
