import Button from '@/components/Button'
import { GlobalColor, GlobalSize, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type FLEX_DIRECTION = 'column' | 'row'

const CustomLayoutTransition = (delay: number) => {
  return (values: any) => {
    'worklet'
    return {
      animations: {
        originX: withTiming(values.targetOriginX, { duration: 1000 }),
        originY: withDelay(
          delay,
          withTiming(values.targetOriginY, { duration: 1000 }),
        ),
        width: withSpring(values.targetWidth),
        // height: withSpring(values.targetHeight),
        height: withDelay(delay, withSpring(values.targetHeight)),
      },
      initialValues: {
        originX: values.currentOriginX,
        originY: values.currentOriginY,
        width: values.currentWidth,
        height: values.currentHeight,
      },
    }
  }
}

const Box = ({ label, state }: { label: string; state: FLEX_DIRECTION }) => {
  const { root } = useStore()
  const index = label.charCodeAt(0) - 'A'.charCodeAt(0)
  const delay = index * 200

  return (
    <Animated.View
      layout={CustomLayoutTransition(delay)}
      style={[
        GlobalStyle(root.dark).animatedBox,
        {
          flexDirection: state,
          justifyContent: state === 'column' ? 'flex-start' : 'center',
          alignItems: state === 'row' ? 'flex-start' : 'center',
          width: state === 'column' ? 80 : 80,
          height: state === 'row' ? 80 : 40,
        },
      ]}
    >
      <Text>{label}</Text>
    </Animated.View>
  )
}

const LayoutTransition = ({ navigation }) => {
  const { root } = useStore()
  const [state, setState] = React.useState<FLEX_DIRECTION>('column')

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
          flexDirection: state,
          marginBottom: GlobalSize.PAGE_DEFAULT_PADDING,
          height: 300,
          width: 300,
          justifyContent: 'space-between',
        }}
      >
        {state === 'column' && <Box key="a" label="A" state={state} />}
        <Box key="b" label="B" state={state} />
        {state === 'row' && <Box key="a" label="A" state={state} />}
        <Box key="c" label="C" state={state} />
      </View>
      <Button
        label="Toggle"
        onPress={() => {
          setState((prev) => (prev === 'column' ? 'row' : 'column'))
        }}
      />
    </View>
  )
}

export default observer(LayoutTransition)
