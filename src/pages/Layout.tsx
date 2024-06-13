import Button from '@/components/Button'
import {
  GlobalColor,
  GlobalFontStyle,
  GlobalSize,
  GlobalStyle,
} from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import Animated, {
  BounceIn,
  BounceOut,
  FadeIn,
  FadeOut,
  FlipInEasyX,
  FlipOutEasyX,
  LightSpeedInLeft,
  LightSpeedOutRight,
  PinwheelIn,
  PinwheelOut,
  RollInLeft,
  RollOutRight,
  RotateInDownLeft,
  RotateInUpLeft,
  SlideInLeft,
  SlideOutRight,
  StretchInX,
  StretchOutX,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated'

const Layout = ({ navigation }) => {
  const { root } = useStore()
  const [render, setRender] = useState(true)

  const commonStyle = [
    __style.view,
    { backgroundColor: GlobalColor(root.dark).SECOND_BLACK },
  ]

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
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
          marginBottom: GlobalSize.PAGE_DEFAULT_PADDING,
        }}
        showsVerticalScrollIndicator={false}
      >
        {render && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>FadeIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={BounceIn.duration(500)}
            exiting={BounceOut.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>BounceIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={BounceIn.duration(500)}
            exiting={BounceOut.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>BounceIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={FlipInEasyX.duration(500)}
            exiting={FlipOutEasyX.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>Flip</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={LightSpeedInLeft.duration(500)}
            exiting={LightSpeedOutRight.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>LightSpeed</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={PinwheelIn.duration(500)}
            exiting={PinwheelOut.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>PinWheel</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={RollInLeft.duration(500)}
            exiting={RollOutRight.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>RollIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={RotateInDownLeft.duration(500)}
            exiting={RotateInUpLeft.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>RotateIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={SlideInLeft.duration(500)}
            exiting={SlideOutRight.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>SlideIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={StretchInX.duration(500)}
            exiting={StretchOutX.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>StretchIn</Text>
          </Animated.View>
        )}
        {render && (
          <Animated.View
            entering={ZoomIn.duration(500)}
            exiting={ZoomOut.duration(500)}
            style={commonStyle}
          >
            <Text style={GlobalFontStyle(root.dark).NORMAL_22}>ZoomIn</Text>
          </Animated.View>
        )}
      </ScrollView>
      <Button onPress={() => setRender(!render)} label="Toggle" />
    </View>
  )
}

const __style = StyleSheet.create({
  view: {
    width: '100%',
    padding: GlobalSize.PAGE_DEFAULT_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: GlobalSize.PAGE_DEFAULT_PADDING,
  },
})

export default observer(Layout)
