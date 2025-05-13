import { ISaldoRepository } from "@/domain/repositories/ISaldoRepository";

export class SaldoService {
  constructor(private saldoRepo: ISaldoRepository) {}

  async get(userId: string) {
    return await this.saldoRepo.get(userId);
  }

  async update(userId: string, novoSaldo: number) {
    return await this.saldoRepo.update(userId, novoSaldo);
  }

  async deposito(userId: string, valor: number ): Promise<any> {
  const saldoAtual = await this.get(userId) ?? 0;
  const novoSaldo = saldoAtual + valor;
  return this.update(userId, novoSaldo);

}
async transferencia(userId: string, valor: number): Promise<number> {
    const saldoAtual = await this.get(userId) ?? 0;
    const novoSaldo = saldoAtual - valor;
    if (novoSaldo < 0) throw new Error("Saldo insuficiente.");
    await this.saldoRepo.update(userId, novoSaldo);
    return novoSaldo;
  }
}
