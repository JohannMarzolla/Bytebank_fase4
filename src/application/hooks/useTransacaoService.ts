import { useMemo } from "react";
import { TransacaoService } from "@/application/services/TransacaoService";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { SaldoService } from "@/application/services/SaldoService";
import { SaldoRepository } from "@/infrastructure/repositories/SaldoRepository";

export function useTransacaoService() {
  const service = useMemo(() => {
    return new TransacaoService(
      new TransacaoRepository(),
      new SaldoService(new SaldoRepository())
    );
  }, []);

  return service;
}
