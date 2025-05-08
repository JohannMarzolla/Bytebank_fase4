export interface ISaldoRepository {
    getSaldo(userId: string): Promise<number | null>;
    updateSaldo(userId: string, novoSaldo: number): Promise<boolean>;
  }