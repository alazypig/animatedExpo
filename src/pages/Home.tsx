import Button from '@/components/Button'
import {
  GlobalColor,
  GlobalColorDark,
  GlobalColorLight,
  GlobalSize,
} from '@/global/style'
import { StatusBar } from 'expo-status-bar'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { PageConfig } from './config'
import React, { useEffect } from 'react'
import { Octicons } from '@expo/vector-icons'
import Logger from '@/utils/logger'
import useStore from '@/store'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { getHeaderTitle } from '@react-navigation/elements'
import { Observer } from 'mobx-react-lite'

if (
  !new (class {
    x
  })().hasOwnProperty('x')
)
  throw new Error('Transpiler is not configured correctly')

const Header = ({
  title,
  dark,
  toggle,
}: {
  title: string
  dark: 'dark' | 'light'
  toggle: () => void
}) => {
  return (
    <View
      style={{
        width: '100%',
        marginTop: 40,
        flexDirection: 'row',
        backgroundColor: 'red',
      }}
    >
      <Text>{title}</Text>
      <TouchableOpacity onPress={toggle}>
        {dark === 'dark' ? (
          <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Octicons name="moon" size={30} color="white" />
          </View>
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Octicons name="sun" size={30} color="black" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const Home = ({ navigation }) => {
  const { root } = useStore()
  const [color, setColor] = React.useState(
    GlobalColor(root.dark).PAGE_BACKGROUND,
  )
  const value = useSharedValue(root.dark === 'dark' ? 1 : 0)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        value.value,
        [0, 1],
        [GlobalColorLight.PAGE_BACKGROUND, GlobalColorDark.PAGE_BACKGROUND],
      ),
    }
  })

  const toggle = () => {
    root.toggleDark()
    setColor('red')
    value.value = withTiming(root.dark === 'dark' ? 1 : 0, { duration: 500 })
    // Logger.info(`value: ${value.value}`)
  }

  useEffect(() => {
    navigation.setOptions({
      header: ({ navigation, route, options, back }) => {
        const title = getHeaderTitle(options, route.name)

        return (
          <Observer>
            {() => <Header title={title} dark={root.dark} toggle={toggle} />}
          </Observer>
        )
      },
      // headerRight: () => (
      //   <Observer>
      //     {() => (
      //       <View>
      //         <TouchableOpacity onPress={toggle}>
      //           {root.dark === 'dark' ? (
      //             <Octicons name="moon" size={24} color="white" />
      //           ) : (
      //             <Octicons name="sun" size={24} color="black" />
      //           )}
      //         </TouchableOpacity>
      //       </View>
      //     )}
      //   </Observer>
      // ),
    })
  }, [navigation])

  useEffect(() => {
    // wait for stores initialization
    setTimeout(() => {
      // Logger.info(`root.dark: ${root.dark}`)
      value.value = root.dark === 'dark' ? 1 : 0
    }, 50)
  }, [])

  return (
    <Animated.ScrollView
      style={[
        {
          width: '100%',
          flex: 1,
          padding: 16,
        },
        animatedStyle,
      ]}
    >
      {Object.keys(PageConfig)
        .filter((i) => i !== 'Home')
        .map((pageName) => (
          <View
            key={pageName}
            style={{ marginBottom: GlobalSize.PAGE_DEFAULT_PADDING }}
          >
            <Button
              label={pageName}
              theme="primary"
              onPress={() => navigation.navigate(pageName)}
            />
          </View>
        ))}
      <StatusBar style="dark" />
    </Animated.ScrollView>
  )
}

export default Home
