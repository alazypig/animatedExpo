import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { GlobalColor, GlobalFontStyle } from '@/global/style'

export default function Button({
  label,
  theme,
  onPress,
}: {
  label: string
  onPress: () => void
  theme?: 'primary'
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        theme === 'primary' && { backgroundColor: GlobalColor.MAIN_YELLOW },
      ]}
      onPress={onPress}
    >
      <Text style={[GlobalFontStyle.NORMAL_18]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    width: '100%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: GlobalColor.BUTTON_BG,
  },
  buttonIcon: {
    paddingRight: 8,
  },
})
