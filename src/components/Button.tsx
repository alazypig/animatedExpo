import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  GlobalColorDark,
  GlobalColorLight,
  GlobalFontStyle,
} from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'

const Button = ({
  label,
  theme,
  onPress,
}: {
  label: string
  onPress: () => void
  theme?: 'primary'
}) => {
  const { root } = useStore()

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        theme === 'primary'
          ? {
              backgroundColor:
                root.dark === 'light'
                  ? GlobalColorLight.BRANDING_ORANGE
                  : GlobalColorDark.BRANDING_ORANGE,
            }
          : {
              backgroundColor:
                root.dark === 'light'
                  ? GlobalColorLight.BRANDING_BLUE
                  : GlobalColorDark.BRANDING_BLUE,
            },
      ]}
      onPress={onPress}
    >
      <Text style={[GlobalFontStyle(root.dark).NORMAL_18]}>{label}</Text>
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
  },
  buttonIcon: {
    paddingRight: 8,
  },
})

export default observer(Button)
