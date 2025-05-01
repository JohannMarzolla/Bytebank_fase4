import { SaldoRepositoryFirestore } from "@/infrastructure/repositories/SaldoRepository";

export function SaldoService(repo: SaldoRepositoryFirestore) {
    return {
      async obterSaldo(userId: string) {
        return await repo.getSaldo(userId);
      },
      async atualizarSaldo(userId: string, novoSaldo: number) {
        return await repo.updateSaldo(userId, novoSaldo);
      }
    };
  }