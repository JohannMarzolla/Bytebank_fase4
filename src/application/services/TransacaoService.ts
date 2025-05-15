import { Transacao } from "@/domain/models/Transacao";
import { TransacaoAdicionar } from "../models/TransacaoAdicionar";
import { ITransacaoRepository } from "@/domain/repositories/ITransacaoRepository";
import { TipoTransacao } from "@/shared/types/TipoTransacaoEnum";
import { SaldoService } from "./SaldoService";

export class TransacaoService {
  constructor(
    private transacaoRepo: ITransacaoRepository,
    private saldoService: SaldoService
  ) {}

  async getPorTipoEData(
    userId: string,
    tipo: TipoTransacao,
    dataInicio: Date,
    dataFim: Date
  ): Promise<Transacao[]> {
    return await this.transacaoRepo.getPorTipoEData(
      userId,
      tipo,
      dataInicio,
      dataFim
    );
  }

  async insert(
    userId: string,
    transacao: TransacaoAdicionar
  ): Promise<string | null> {
    if (!userId) throw new Error("Usuário inválido.");

    if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      await this.saldoService.deposito(userId, transacao.valor);
    } else if (transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA) {
      const saldoSuficiente = await this.saldoService.verificaSaldo(
        userId,
        transacao.valor
      );

      if (!saldoSuficiente) {
        throw new Error("Saldo insuficiente para realizar a transferência.");
      }

      await this.saldoService.transferencia(userId, transacao.valor);
    }

    let fileUrl: string | null = null;
    if (transacao.file) {
      fileUrl = await this.transacaoRepo.uploadFile(transacao.file);
    }

    return await this.transacaoRepo.insert(
      new Transacao({
        userId,
        tipoTransacao: transacao.tipoTransacao,
        valor: transacao.valor,
        date: transacao.date,
        file: fileUrl ?? undefined,
        fileName: fileUrl ? transacao.file?.name : undefined,
      })
    );
  }

  async update(transacao: Transacao): Promise<boolean> {
    if (!transacao?.userId || !transacao?.id) {
      throw new Error("Usuário ou ID da transação inválido.");
    }
    if (!Object.keys(transacao).length) {
      throw new Error("Nenhum valor fornecido para atualização.");
    }

    const previous = await this.transacaoRepo.getPorID(
      transacao.userId,
      transacao.id
    );
    if (!previous) throw new Error("Transação não existe");

    const newTransacao = new Transacao(transacao);
    await this._updateSaldo(newTransacao, previous);

    await this.transacaoRepo.update(transacao);
    return true;
  }

  async delete(userId: string, transacaoId: string): Promise<boolean> {
    const transacao = await this.transacaoRepo.getPorID(userId, transacaoId);

    if (!transacao) throw new Error("Transação não encontrada.");

    const saldoAtual = (await this.saldoService.get(userId)) ?? 0;
    let novoSaldo = saldoAtual;
    if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      novoSaldo -= transacao.valor;
    } else {
      novoSaldo += transacao.valor;
    }
    await this.saldoService.update(userId, novoSaldo);
    return await this.transacaoRepo.delete(userId, transacaoId);
  }

  private async _updateSaldo(newValues: Transacao, previous: Transacao) {
    const saldoAtual = await this.saldoService.get(newValues.userId);
    if (saldoAtual === null) {
      throw new Error("Erro ao obter saldo atual");
    }

    let newSaldo = saldoAtual;
    previous.tipoTransacao === TipoTransacao.DEPOSITO
      ? (newSaldo -= previous.valor ?? 0)
      : (newSaldo += previous.valor ?? 0);

    newValues.tipoTransacao === TipoTransacao.DEPOSITO
      ? (newSaldo += newValues.valor ?? 0)
      : (newSaldo -= newValues.valor ?? 0);

    if (newSaldo < 0) {
      throw new Error("Saldo insuficiente.");
    }

    await this.saldoService.update(newValues.userId, newSaldo);
    return true;
  }
}
