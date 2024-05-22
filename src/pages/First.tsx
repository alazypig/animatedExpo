import Button from '@/components/Button'
import { GlobalStyle } from '@/global/style'
import { View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'

const First = () => {
  const width = useSharedValue(100)

  return (
    <View style={GlobalStyle.page}>
      <Animated.View
        style={{
          width,
          height: 100,
          borderRadius: 8,
          backgroundColor: '#e099f2',
        }}
      />
      <View style={{ marginTop: 16, width: 200 }}>
        <Button
          onPress={() => {
            if (width.value > 200) {
              width.value = withSpring(100)
            } else {
              width.value = withSpring(width.value + 30)
            }
          }}
          label="Press me"
        />
      </View>
    </View>
  )
}

export default First
