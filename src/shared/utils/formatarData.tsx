export enum FormatoDataEnum {
  PADRAO = "DD/MM/AAAA",
  DIA_SEMANA_DIA_MES_ANO = "DIA_SEMANA, DD/MM/AAAA",
  DIA_MES = "DD/MM",
  MES = "MM",
  MES_ANO = "MM/AAAA",
}

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
    case FormatoDataEnum.MES_ANO:
      return data.toLocaleDateString("pt-br", {
        year: "numeric",
        month: "2-digit",
      });
    default:
      return data.toLocaleDateString("pt-br");
  }
}
