import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Icon, { IconProps } from "./Icon";

interface IconButtonProps extends TouchableOpacityProps {
  iconProps: IconProps;
}

export default function IconButton({ iconProps, ...rest }: IconButtonProps) {
  return (
    <TouchableOpacity
      {...rest}
      style={[{ padding: 8 }, rest.style]} // Adiciona padding padrão para área clicável
    >
      <Icon {...iconProps} />
    </TouchableOpacity>
  );
}
