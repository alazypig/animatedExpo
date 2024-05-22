import Button from '@/components/Button'
import { GlobalStyle } from '@/global/style'
import React from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const TranslateX: React.FC<{}> = () => {
  const translateX = useSharedValue<number>(0)
  const STEP = 50

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value) }],
  }))

  return (
    <View style={GlobalStyle.page}>
      <View style={{ width: '100%', height: 150 }}>
        <Animated.View style={[GlobalStyle.animatedBox, animatedStyle]} />
      </View>
      <Button
        label="Press me"
        onPress={() => {
          if (translateX.value > 200) {
            translateX.value = 0
          } else {
            translateX.value += STEP
          }
        }}
      />
    </View>
  )
}

export default TranslateX
