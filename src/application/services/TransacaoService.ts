
import { Transacao } from "@/domain/models/Transacao";
import { TransacaoAdicionar } from "@/domain/models/TransacaoAdicionar";
import { getSaldo, postSaldo } from "@/domain/services/SaldoServices";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { ShowToast } from "@/presentation/components/ui/Toast";


export function TransacaoService(repository: TransacaoRepository){ 
    return{

async buscarTransacoes(userId: string): Promise<Transacao[]> {
  return await repository.getTransacoes(userId);
},

 async  buscarTransacaoPorId(userId: string, transacaoId: string): Promise<Transacao | null> {
  return await repository.getTransacao(userId, transacaoId);
},

 async  buscarTransacoesPaginadas(
    userId: string,
     limite: number, 
     lastDoc?: any, 
     tipoFiltro?: string, 
     dataInicio?: Date | null, 
     dataFim?: Date | null
    ) {
  return await repository.getTransacoesLimitId(userId, limite, lastDoc, tipoFiltro, dataInicio, dataFim);
},

 async  adicionarTransacao(userId: string, transacao: TransacaoAdicionar): Promise<string | null> {
    console.log("Inicio do metodo adicionar transacao")
  let fileUrl = null;
  if (transacao.file){
     fileUrl = await repository.uploadFile(transacao.file);
  }
  const novaTransacao = {
    userId,
    tipoTransacao: transacao.tipoTransacao,
    valor: transacao.valor,
    date: transacao.date.toISOString(),
    file: fileUrl,
    fileName: fileUrl ? transacao.file?.name : null,
  };
  return await repository.postTransacao(userId, novaTransacao);
},

 async atualizarTransacao(userId: string, id: string, novosDados: Partial<Transacao>): Promise<boolean> {

    if (!userId || !id) {
        throw new Error("Usuário ou ID da transação inválido.");
      }
      if (!Object.keys(novosDados).length) {
        throw new Error("Nenhum dado fornecido para atualização.");
      }
      const dadosAtualizados = {
        ...novosDados,
        date:
          novosDados.date instanceof Date
            ? novosDados.date.toISOString()
            : novosDados.date,
      };

  const transacaoAntiga = await repository.getTransacao(userId, id) as Transacao;
  if (!transacaoAntiga) {
    ShowToast("error", "Transação não encontrada.");
    return false;
  }
  const saldoAtual = await getSaldo(userId);
  if (saldoAtual === null) {
    ShowToast("error", "Erro ao obter saldo atual.");
    return false;
  }

  let novoSaldo = saldoAtual;

  transacaoAntiga.tipoTransacao === "deposito" 
  ? (novoSaldo -= transacaoAntiga.valor ?? 0) 
  : (novoSaldo += transacaoAntiga.valor ?? 0);

  novosDados.tipoTransacao === "deposito" 
  ? (novoSaldo += novosDados.valor ?? 0) 
  : (novoSaldo -= novosDados.valor ?? 0);

  if (novoSaldo < 0) {
    ShowToast("error", "Saldo insuficiente.");
    return false;
  }
  await postSaldo(userId, novoSaldo);
  console.log("novos dados : " ,novosDados)
  console.log("dados atualizados" , dadosAtualizados)
  return await repository.putTransacao(userId, id, novosDados);
},

 async  deletarTransacao(userId: string, transacaoId: string): Promise<boolean> {
  return await repository.deleteTransacao(userId, transacaoId);
},
};
}