import Button from '@/components/Button'
import { GlobalColor, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

const Shake = ({ navigation }) => {
  const { root } = useStore()

  const translateX = useSharedValue<number>(0)
  const STEP = 10
  const TIME = 50

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value) }],
  }))

  const shake = () => {
    translateX.value = withSequence(
      withTiming(STEP, { duration: TIME / 2 }),
      withRepeat(withTiming(-STEP, { duration: TIME }), 3, true),
      withTiming(0, { duration: TIME / 2 }),
    )
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
      <View
        style={{
          width: '100%',
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[GlobalStyle(root.dark).animatedBox, animatedStyle]}
        />
      </View>
      <Button label="Press me" onPress={shake} />
    </View>
  )
}

export default observer(Shake)
