import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import { observer } from 'mobx-react-lite'
import useStore from '@/store'
import { GlobalColor, GlobalFontStyle, GlobalStyle } from '@/global/style'

const Draggable = ({ navigation }) => {
  const { root } = useStore()
  const { CYAN, RED } = GlobalColor(root.dark)

  const pressed = useSharedValue<boolean>(false)

  const offsetX = useSharedValue<number>(0)
  const offsetY = useSharedValue<number>(0)

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true
    })
    .onChange((event) => {
      offsetX.value = event.translationX
      offsetY.value = event.translationY
    })
    .onFinalize(() => {
      offsetX.value = withSpring(0)
      offsetY.value = withSpring(0)
      pressed.value = false
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: withTiming(pressed.value ? 1.2 : 1) },
    ],
    backgroundColor: pressed.value ? RED : CYAN,
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
    <GestureHandlerRootView style={GlobalStyle(root.dark).page}>
      <View style={GlobalStyle(root.dark).page}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              GlobalStyle(root.dark).animatedBox,
              {
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              },
              animatedStyles,
            ]}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_14}>Drag Me</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  )
}

export default observer(Draggable)
