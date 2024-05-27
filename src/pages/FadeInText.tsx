import Button from '@/components/Button'
import { GlobalColor, GlobalSize, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const DURATION = 500
const DELAY = 200

const FadeInText = ({ navigation }) => {
  const [show, setShow] = useState(true)
  const { root } = useStore()
  const opacity1 = useSharedValue(1)
  const opacity2 = useSharedValue(1)
  const texts = ['Fade', 'In']

  const toggle = () => {
    if (show) {
      opacity2.value = withDelay(
        0 * DELAY,
        withTiming(0, { duration: DURATION }),
      )
      opacity1.value = withDelay(
        1 * DELAY,
        withTiming(0, { duration: DURATION }),
      )
    } else {
      opacity1.value = withDelay(
        0 * DELAY,
        withTiming(1, { duration: DURATION }),
      )
      opacity2.value = withDelay(
        1 * DELAY,
        withTiming(1, { duration: DURATION }),
      )
    }

    setShow(!show)
  }

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
      },
      headerTintColor: GlobalColor(root.dark).BLACK,
    })
  }, [navigation])

  return (
    <View style={GlobalStyle(root.dark).page}>
      <Animated.Text
        style={{
          color: GlobalColor(root.dark).BLACK,
          fontSize: 30,
          lineHeight: 32,
          opacity: opacity1,
        }}
      >
        {texts[0]}
      </Animated.Text>
      <Animated.Text
        style={{
          color: GlobalColor(root.dark).BLACK,
          fontSize: 30,
          lineHeight: 32,
          opacity: opacity2,
          marginBottom: GlobalSize.PAGE_DEFAULT_PADDING,
        }}
      >
        {texts[1]}
      </Animated.Text>
      <Button onPress={toggle} label="Toggle" />
    </View>
  )
}

export default observer(FadeInText)
