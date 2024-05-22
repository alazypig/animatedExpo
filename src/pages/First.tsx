import { GlobalStyle } from '@/global/style'
import { View, Text, Button } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'

const First = () => {
  const width = useSharedValue(100)

  return (
    <View style={GlobalStyle.page    }>
      <Animated.View style={{
          width, 
          height: 100,
          backgroundColor: 'violet',
        }}
      />
      <Button
        onPress={() => {
          width.value += 10
        }}
        title="press me"
      />
    </View>
  )
}

export default First
