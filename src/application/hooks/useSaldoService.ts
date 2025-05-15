import { useMemo } from "react";
import { SaldoService } from "@/application/services/SaldoService";
import { SaldoRepository } from "@/infrastructure/repositories/SaldoRepository";

export function useSaldoService() {
  const service = useMemo(() => {
    return new SaldoService(new SaldoRepository());
  }, []);

  return service;
}
