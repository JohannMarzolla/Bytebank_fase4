export function formatarMoeda(valor: number): string {
  return valor?.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}
