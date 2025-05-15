import { useMemo } from "react";
import { GraficoService } from "@/application/services/GraficoService";
import { TransacaoRepository } from "@/infrastructure/repositories/TransacaoRepository";

export function useGraficoService() {
  const service = useMemo(() => {
    return new GraficoService(new TransacaoRepository());
  }, []);

  return service;
}
