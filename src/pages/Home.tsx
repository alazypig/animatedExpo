import Button from '@/components/Button'
import {
  GlobalColor,
  GlobalColorDark,
  GlobalColorLight,
  GlobalSize,
} from '@/global/style'
import { StatusBar } from 'expo-status-bar'
import { View, TouchableOpacity, Text, Platform } from 'react-native'
import { PageConfig } from './config'
import React, { useEffect } from 'react'
import { Octicons, AntDesign } from '@expo/vector-icons'
import Logger from '@/utils/logger'
import useStore from '@/store'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Observer, observer } from 'mobx-react-lite'

if (
  !new (class {
    x
  })().hasOwnProperty('x')
)
  throw new Error('Transpiler is not configured correctly')

const Home = ({ navigation }) => {
  const { root } = useStore()
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
    value.value = withTiming(root.dark === 'dark' ? 1 : 0, { duration: 200 })

    navigation.setOptions({
      headerStyle: {
        backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
      },
      headerTintColor: GlobalColor(root.dark).BLACK,
    })

    Logger.info(`value: ${value.value}`)
  }

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND },
      headerTintColor: GlobalColor(root.dark).BLACK,
      headerRight: () => (
        <Observer>
          {() => (
            <View
              style={{
                marginRight:
                  Platform.OS === 'web' ? GlobalSize.PAGE_DEFAULT_PADDING : 0,
              }}
            >
              <TouchableOpacity onPress={toggle}>
                {root.dark === 'dark' ? (
                  <Octicons name="moon" size={24} color="white" />
                ) : (
                  <Octicons name="sun" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </Observer>
      ),
    })
  }, [navigation, root])

  useEffect(() => {
    setTimeout(() => {
      value.value = withTiming(root.dark === 'dark' ? 1 : 0, { duration: 200 })
      navigation.setOptions({
        headerStyle: {
          backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
        },
        headerTintColor: GlobalColor(root.dark).BLACK,
      })
    }, 50)
  }, [])

  return root.loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Image source={require('@/assets/images/splash.png')} /> */}
      <AntDesign name="loading1" size={24} color="black" />
      <Text style={{ marginTop: GlobalSize.PAGE_DEFAULT_PADDING }}>
        Loading...
      </Text>
    </View>
  ) : (
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

export default observer(Home)
