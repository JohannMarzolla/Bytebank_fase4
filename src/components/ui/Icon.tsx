import { MaterialIcons } from '@expo/vector-icons'
import { StyleProp, TextStyle } from 'react-native'

export interface IconProps {
  name: keyof typeof MaterialIcons.glyphMap
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
  onPress? : ()=> void
}

export default function Icon({ name, size = 24, color = '#000', style }: IconProps) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />
}