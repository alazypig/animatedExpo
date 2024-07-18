/**
 * @author Edward
 * @date 2024/06/12
 * @description Drawer HOC 文件
 * usage: /src/test/drawerTest/DrawerWithExpandable.tsx
 */
import { GlobalColor, GlobalSize } from '@/global/style'
import { DARK_TYPE } from '@/global/type'
import { hp } from '@/utils'
import React, { useEffect } from 'react'
import { ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const DrawerHOC = (
  WrappedComponent: React.ElementType<{
    onClose: (cb: () => void) => void
  }>,
  config: {
    dark: DARK_TYPE
    duration?: number
    styles?: {
      mask?: ViewStyle
      drawer?: ViewStyle
    }
  },
) => {
  const Drawer = () => {
    const DURATION = config.duration || 300
    const { mask = {}, drawer = {} } = config.styles || {}
    const PAGE_HEIGHT = hp(100)
    const backgroundOpacity = useSharedValue(0)
    const drawerShow = useSharedValue(0)

    const drawerBackground = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        backgroundOpacity.value,
        [0, 1],
        ['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)'],
      ),
    }))

    const drawerContent = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(drawerShow.value, [0, 1], [PAGE_HEIGHT, 0]),
        },
      ],
    }))

    const close = (cb?: () => void) => {
      // BUG: the close function here should be async. otherwise the animation will laggy.
      drawerShow.value = withTiming(0, { duration: DURATION })
      backgroundOpacity.value = withTiming(0, { duration: DURATION }, () => {
        if (cb) {
          runOnJS(cb)()
        }
      })
    }

    const open = () => {
      drawerShow.value = withTiming(1, { duration: DURATION })
      backgroundOpacity.value = withTiming(1, { duration: DURATION })
    }

    useEffect(() => {
      open()
    }, [])

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flex: 1,
            justifyContent: 'flex-end',
          },
          // TODO: mask style
          mask,
          drawerBackground as any,
        ]}
      >
        <Animated.View
          style={[
            {
              padding: GlobalSize.PAGE_DEFAULT_PADDING,
              backgroundColor: GlobalColor(config.dark).PAGE_BACKGROUND,
              alignItems: 'center',
            },
            drawer,
            drawerContent,
          ]}
        >
          <WrappedComponent onClose={close} />
        </Animated.View>
      </Animated.View>
    )
  }

  return Drawer
}

export default DrawerHOC
