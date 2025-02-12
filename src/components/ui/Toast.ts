import { colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";

export function ShowToast(
  type: "success" | "error",
  message: string,
  detail?: string
) {
  Toast.show({
    type: type ?? "success",
    text1: message,
    text1Style: { fontSize: 14 },
    text2: detail,
    text2Style: { fontSize: 13, color: colors.fiap.gray },
    position: "bottom",
  });
}
