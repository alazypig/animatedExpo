import Button from '@/components/Button'
import { GlobalColor, GlobalStyle } from '@/global/style'
import { View } from 'react-native'
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Svg, Circle } from 'react-native-svg'

const ACircle = Animated.createAnimatedComponent(Circle)

const AnimatedCircle: React.FC<{}> = () => {
  const radius = useSharedValue<number>(20)
  const STEP = 30

  const animatedProps = useAnimatedProps(() => ({
    r: withTiming(radius.value, { duration: 500 }),
  }))

  return (
    <View style={GlobalStyle.page}>
      <Svg style={{ width: 300, height: 300 }}>
        <ACircle
          cx="50%"
          cy="50%"
          fill={GlobalColor.BOX_BG}
          animatedProps={animatedProps}
        />
      </Svg>
      <Button
        label="Press me"
        onPress={() => {
          if (radius.value > 100) {
            radius.value = 20
          } else {
            radius.value += STEP
          }
        }}
      />
    </View>
  )
}

export default AnimatedCircle
