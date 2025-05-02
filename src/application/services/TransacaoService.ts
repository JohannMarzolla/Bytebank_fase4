
// // export function SaldoService(repo: SaldoRepositoryFirestore) {
// //     return {
// //       async obterSaldo(userId: string) {
// //         return await repo.getSaldo(userId);
// //       },
// //       async atualizarSaldo(userId: string, novoSaldo: number) {
// //         return await repo.updateSaldo(userId, novoSaldo);
// //       }
// //     };
// //   }

// import { Transacao } from "@/domain/models/Transacao";
// import { TransacaoAdicionar } from "@/domain/models/TransacaoAdicionar";
// import { getSaldo, postSaldo } from "@/domain/services/SaldoServices";
// import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
// import { ShowToast } from "@/presentation/components/ui/Toast";

// const repository = new TransacaoRepository();

// async function buscarTransacoes(userId: string): Promise<Transacao[]> {
//   return await repository.getTransacoes(userId);
// }

//  async function buscarTransacaoPorId(userId: string, transacaoId: string): Promise<Transacao | null> {
//   return await repository.getTransacao(userId, transacaoId);
// }

//  async function buscarTransacoesPaginadas(
//     userId: string,
//      limite: number, 
//      lastDoc?: any, 
//      tipoFiltro?: string, 
//      dataInicio?: Date | null, 
//      dataFim?: Date | null
//     ) {
//   return await repository.getTransacoesLimitId(userId, limite, lastDoc, tipoFiltro, dataInicio, dataFim);
// }

//  async function adicionarTransacao(userId: string, transacao: TransacaoAdicionar): Promise<string | null> {
//   let fileUrl = null;
//   if (transacao.file) fileUrl = await repository.uploadFile(transacao.file);
//   const novaTransacao = {
//     userId,
//     tipoTransacao: transacao.tipoTransacao,
//     valor: transacao.valor,
//     date: transacao.date.toISOString(),
//     file: fileUrl,
//     fileName: fileUrl ? transacao.file?.name : null,
//   };
//   const saldoAtual = await getSaldo(userId);
//   let novoSaldo = saldoAtual ?? 0;
//   if (transacao.tipoTransacao === "deposito") novoSaldo += transacao.valor ?? 0;
//   else novoSaldo -= transacao.valor ?? 0;
//   if (novoSaldo < 0) {
//     ShowToast("error", "Saldo insuficiente para essa operação.");
//     return null;
//   }
//   await postSaldo(userId, novoSaldo);
//   return await repository.postTransacao(userId, novaTransacao);
// }

//  async function atualizarTransacao(userId: string, id: string, novosDados: Partial<Transacao>): Promise<boolean> {
//   const transacaoAntiga = await repository.getTransacao(userId, id);
//   if (!transacaoAntiga) {
//     ShowToast("error", "Transação não encontrada.");
//     return false;
//   }
//   const saldoAtual = await getSaldo(userId);
//   if (saldoAtual === null) {
//     ShowToast("error", "Erro ao obter saldo atual.");
//     return false;
//   }
//   let novoSaldo = saldoAtual;
//   transacaoAntiga.tipoTransacao === "deposito" ? (novoSaldo -= transacaoAntiga.valor ?? 0) : (novoSaldo += transacaoAntiga.valor ?? 0);
//   novosDados.tipoTransacao === "deposito" ? (novoSaldo += novosDados.valor ?? 0) : (novoSaldo -= novosDados.valor ?? 0);
//   if (novoSaldo < 0) {
//     ShowToast("error", "Saldo insuficiente.");
//     return false;
//   }
//   await postSaldo(userId, novoSaldo);
//   return await repository.putTransacao(userId, id, {
//     ...novosDados,
//     date: novosDados.date instanceof Date ? novosDados.date.toISOString() : novosDados.date,
//   });
// }

//  async function deletarTransacao(userId: string, transacaoId: string): Promise<boolean> {
//   return await repository.deleteTransacao(userId, transacaoId);
// }
