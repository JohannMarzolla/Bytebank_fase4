import { useMemo } from "react";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";
import { TransacoesPaginatedService } from "@/application/services/TransacoesPaginatedService";

export function useTransacoesPaginatedService() {
  const service = useMemo(() => {
    return new TransacoesPaginatedService(new TransacaoRepository());
  }, []);

  return service;
}
