import Button from '@/components/Button'
import { GlobalStyle } from '@/global/style'
import React from 'react'
import { View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'

const Width: React.FC = () => {
  const width = useSharedValue(100)
  const STEP = 30

  return (
    <View style={GlobalStyle.page}>
      <Animated.View style={[GlobalStyle.animatedBox, { width }]} />
      <View style={{ marginTop: 16, width: 200 }}>
        <Button
          onPress={() => {
            if (width.value > 200) {
              width.value = withSpring(100)
            } else {
              width.value = withSpring(width.value + STEP)
            }
          }}
          label="Press me"
        />
      </View>
    </View>
  )
}

export default Width
