import { ISaldoRepository } from "@/domain/repositories/ISaldoRepository";

export class SaldoService {
  constructor(private saldoRepo: ISaldoRepository) {}

  async get(userId: string) {
    return await this.saldoRepo.get(userId);
  }

  async update(userId: string, novoSaldo: number) {
    return await this.saldoRepo.update(userId, novoSaldo);
  }
}
