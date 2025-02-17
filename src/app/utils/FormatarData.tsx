import { FormatoDataEnum } from "../types/FormatoData";

export function formatarData(
  data: Date,
  formato: FormatoDataEnum = FormatoDataEnum.PADRAO
): string {
  switch (formato) {
    case FormatoDataEnum.DIA_SEMANA_DIA_MES_ANO:
      return data.toLocaleDateString("pt-br", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    case FormatoDataEnum.DIA_MES:
      return data.toLocaleDateString("pt-br", {
        day: "2-digit",
        month: "2-digit",
      });
    case FormatoDataEnum.MES:
      return data.toLocaleDateString("pt-br", { month: "long" });
    default:
      return data.toLocaleDateString("pt-br");
  }
}
