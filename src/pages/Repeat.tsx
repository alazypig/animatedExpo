import Button from '@/components/Button'
import { GlobalColor, GlobalSize, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const Repeat = ({ navigation }) => {
  const { root } = useStore()
  const [start, setStart] = useState(false)
  const scale = useSharedValue(1)
  const rotate = useDerivedValue(() => `${scale.value * 3}rad`)

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value }],
  }))

  const startAnimation = () => {
    if (start) {
      return
    }

    scale.value = withRepeat(
      withTiming(scale.value * 1.2, { duration: 500 }),
      -1,
      true,
    )
    setStart(true)
  }

  const stopAnimation = () => {
    if (!start) {
      return
    }

    cancelAnimation(scale)

    scale.value = withTiming(1, { duration: 500 })

    setStart(false)
  }

  useEffect(() => {
    startAnimation()
  }, [])

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
      <Animated.View style={[GlobalStyle(root.dark).animatedBox, scaleStyle]} />
      <Animated.View
        style={[
          GlobalStyle(root.dark).animatedBox,
          { marginVertical: 50 },
          rotateStyle,
        ]}
      />
      <Button onPress={startAnimation} label="Start" />
      <View style={{ height: GlobalSize.PAGE_DEFAULT_PADDING }} />
      <Button onPress={stopAnimation} label="Stop" theme="primary" />
    </View>
  )
}

export default observer(Repeat)
