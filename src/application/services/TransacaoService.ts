// services/TransacaoService.ts
import { Transacao } from "@/domain/models/Transacao";
import { ShowToast } from "@/presentation/components/ui/Toast";
import { TransacaoAdicionar } from "../models/TransacaoAdicionar";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { ISaldoRepository } from "@/domain/repositories/ISaldoRepository";
import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";


export class TransacaoService {
  constructor(
    private transacaoRepo: ITransacaoRepository,
    private saldoRepo: ISaldoRepository
  ) {}

  async buscarTransacoes(userId: string): Promise<Transacao[]> {
    return await this.transacaoRepo.getTransacoes(userId);
  }
  async buscarTransacoesPorTipoEData( 
        userId: string,
        tipo: TipoTransacao,
        dataInicio: Date,
        dataFim: Date) : Promise<Transacao[]>{
          return await this.transacaoRepo.getTransacoesPorTipoEData(userId,tipo,dataInicio,dataFim)

        }

  async buscarTransacaoPorId(userId: string, transacaoId: string): Promise<Transacao | null> {
    return await this.transacaoRepo.getTransacao(userId, transacaoId);
  }

  async buscarTransacoesPaginadas(
    userId: string,
    limite: number,
    lastDoc?: any,
    tipoFiltro?: string,
    dataInicio?: Date | null,
    dataFim?: Date | null
  ) {
    return await this.transacaoRepo.getTransacoesLimitId(
      userId,
      limite,
      lastDoc,
      tipoFiltro,
      dataInicio,
      dataFim
    );
  }

  async adicionarTransacao(userId: string, transacao: TransacaoAdicionar): Promise<string | null> {
    let fileUrl = null;
    if (transacao.file) {
      fileUrl = await this.transacaoRepo.uploadFile(transacao.file);
    }

    const novaTransacao = {
      userId,
      tipoTransacao: transacao.tipoTransacao,
      valor: transacao.valor,
      date: transacao.date.toISOString(),
      file: fileUrl,
      fileName: fileUrl ? transacao.file?.name : null,
    };

    return await this.transacaoRepo.postTransacao(userId, novaTransacao);
  }

  async atualizarTransacao(userId: string, id: string, novosDados: Transacao): Promise<boolean> {
    if (!userId || !id) throw new Error("Usuário ou ID da transação inválido.");
    if (!Object.keys(novosDados).length) throw new Error("Nenhum dado fornecido para atualização.");

    const dadosAtualizados: Transacao = {
      ...novosDados,
      date:
        novosDados.date instanceof Date
          ? novosDados.date.toISOString()
          : novosDados.date,
    };

    const transacaoAntiga = await this.transacaoRepo.getTransacao(userId, id);
    if (!transacaoAntiga) {
      ShowToast("error", "Transação não encontrada.");
      return false;
    }

    const saldoAtual = await this.saldoRepo.getSaldo(userId);
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

    await this.saldoRepo.updateSaldo(userId, novoSaldo);
    return await this.transacaoRepo.putTransacao(userId, id, dadosAtualizados);
  }

  async deletarTransacao(userId: string, transacaoId: string): Promise<boolean> {
    return await this.transacaoRepo.deleteTransacao(userId, transacaoId);
  }
}
