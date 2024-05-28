import { GlobalColor, GlobalFontStyle, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { Logger } from '@/utils'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const CountItem = ({ current, next }: { current: number; next: number }) => {
  // Logger.info(`current: ${current}, next: ${next}`)
  const { root } = useStore()
  const translateY = useSharedValue(-50)
  const translateYNext = useSharedValue(0)

  if (next !== current) {
    translateY.value = -50 // reset position
    translateY.value = withTiming(
      0,
      {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      },
      () => {},
    )
    translateYNext.value = 0
    translateYNext.value = withTiming(50, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    })
  }

  const __style = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      width: 30,
      // backgroundColor: 'red',
      overflow: 'hidden',
    },
    numberContainer: {
      position: 'absolute',
      top: 0,
    },
    currentNumberContainer: {
      position: 'absolute',
      top: 0,
    },
    number: {
      fontSize: 48,
      lineHeight: 50,
      fontWeight: 'bold',
      color: GlobalColor(root.dark).BLACK,
      textAlignVertical: 'center',
    },
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  const animatedStyleNext = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYNext.value }],
    }
  })

  return (
    <View style={__style.container}>
      <Animated.View
        style={[__style.currentNumberContainer, animatedStyleNext]}
      >
        <Text style={__style.number}>{current}</Text>
      </Animated.View>
      <Animated.View style={[__style.numberContainer, animatedStyle]}>
        <Text style={__style.number}>{next}</Text>
      </Animated.View>
    </View>
  )
}

const CountDown = ({ time, nextTime }: { time: number; nextTime: number }) => {
  const { root } = useStore()
  const parseTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    const days = Math.floor(time / (1000 * 60 * 60 * 24))

    return { seconds, minutes, hours, days }
  }

  const timeParses = parseTime(time)
  const nextTimeParses = parseTime(nextTime)

  const __style = StyleSheet.create({
    number: {
      fontSize: 48,
      lineHeight: 50,
      fontWeight: 'bold',
      color: GlobalColor(root.dark).BLACK,
      textAlignVertical: 'center',
    },
  })

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <CountItem
          current={Math.floor(timeParses.days / 100)}
          next={Math.floor(nextTimeParses.days / 100)}
        />
        <CountItem
          current={Math.floor(timeParses.days / 10)}
          next={Math.floor(nextTimeParses.days / 10)}
        />
        <CountItem
          current={Math.floor(timeParses.days % 10)}
          next={Math.floor(nextTimeParses.days % 10)}
        />
        <Text style={__style.number}>Days</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row' }}>
          <CountItem
            current={Math.floor(timeParses.hours / 10)}
            next={Math.floor(nextTimeParses.hours / 10)}
          />
          <CountItem
            current={Math.floor(timeParses.hours % 10)}
            next={Math.floor(nextTimeParses.hours % 10)}
          />
        </View>
        <Text style={__style.number}>:</Text>
        <View style={{ flexDirection: 'row' }}>
          <CountItem
            current={Math.floor(timeParses.minutes / 10)}
            next={Math.floor(nextTimeParses.minutes / 10)}
          />
          <CountItem
            current={Math.floor(timeParses.minutes % 10)}
            next={Math.floor(nextTimeParses.minutes % 10)}
          />
        </View>
        <Text style={__style.number}>:</Text>
        <View style={{ flexDirection: 'row' }}>
          <CountItem
            current={Math.floor(timeParses.seconds / 10)}
            next={Math.floor(nextTimeParses.seconds / 10)}
          />
          <CountItem
            current={Math.floor(timeParses.seconds % 10)}
            next={Math.floor(nextTimeParses.seconds % 10)}
          />
        </View>
      </View>
    </View>
  )
}

const CountDownPage = ({ navigation }) => {
  const { root } = useStore()
  const targetTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 15)
  const [time, setTime] = useState(0)
  const [nextTime, setNextTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const diff = targetTime.getTime() - now
      const nextDiff = targetTime.getTime() - (now + 1000)

      setTime(diff)
      setNextTime(nextDiff)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

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
      {time === 0 ? (
        <Text
          style={{
            fontSize: 30,
            height: 40,
            color: GlobalColor(root.dark).BLACK,
          }}
        >
          Loading...
        </Text>
      ) : (
        <CountDown time={time} nextTime={nextTime} />
      )}
    </View>
  )
}

export default observer(CountDownPage)
