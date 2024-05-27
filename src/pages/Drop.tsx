import React, { useEffect } from 'react'
import { LayoutChangeEvent, View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import { observer } from 'mobx-react-lite'
import useStore from '@/store'
import { GlobalColor, GlobalFontStyle, GlobalStyle } from '@/global/style'
import { Logger } from '@/utils'

const SIZE = 100

const Drop = ({ navigation }) => {
  const { root } = useStore()
  const offsetX = useSharedValue<number>(0)
  const offsetY = useSharedValue<number>(0)
  const width = useSharedValue<number>(0)
  const height = useSharedValue<number>(0)

  const onLayout = (event: LayoutChangeEvent) => {
    // Logger.info(`width: ${JSON.stringify(event.nativeEvent.layout)}`)
    width.value = event.nativeEvent.layout.width
    height.value = event.nativeEvent.layout.height
  }

  const pan = Gesture.Pan()
    .onChange((event) => {
      // Logger.info(`changeY: ${event.changeY}, changeX: ${event.changeX}`)
      offsetX.value += event.changeX
      offsetY.value += event.changeY
    })
    .onFinalize((event) => {
      offsetX.value = withDecay({
        velocity: event.velocityX,
        rubberBandEffect: true,
        // clamp: [-(width.value / 2) + SIZE / 2, width.value / 2 - SIZE / 2],
        clamp: [0, width.value - SIZE],
      })
      offsetY.value = withDecay({
        velocity: event.velocityY,
        rubberBandEffect: true,
        clamp: [0, height.value - SIZE],
      })
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }))

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
      },
      headerTintColor: GlobalColor(root.dark).BLACK,
    })
  }, [navigation])

  return (
    <GestureHandlerRootView>
      <View style={GlobalStyle(root.dark).page}>
        <View
          style={{
            width: 300,
            height: 300,
            borderColor: GlobalColor(root.dark).CYAN,
            borderRadius: 8,
            borderWidth: 1,
          }}
          onLayout={onLayout}
        >
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                GlobalStyle(root.dark).animatedBox,
                { justifyContent: 'center', alignItems: 'center' },
                animatedStyles,
              ]}
            >
              <Text style={GlobalFontStyle(root.dark).NORMAL_16}>Drag me</Text>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

export default observer(Drop)
