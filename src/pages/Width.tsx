import Button from '@/components/Button'
import { GlobalColor, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'

const Width = ({ navigation }) => {
  const { root } = useStore()
  const width = useSharedValue(100)
  const STEP = 30

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
      <Animated.View style={[GlobalStyle(root.dark).animatedBox, { width }]} />
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

export default observer(Width)
