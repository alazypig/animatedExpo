// /**
//  *
//  * usage:
//  * import Slider from '@/components/utils/Slider'
//  *
//  * const [value, setValue] = useState(0)
//  *
//  * <Slider
//   onValueChange={(value: number) => {}}
//   onSlidingComplete={(value: number) => {}}
//   minimumValue={0}
//   maxAvailableValue={25}
//   maximumValue={100}
//   value={value}
//   thumbTouchSize={{ width: 40, height: 40 }}
//   step={1}
//   trackStyle={{}}
//   thumbStyle={{}}
//   minimumTrackTintColor={AntQColors.MAIN_YELLOW}
//   labelCount={5}
//   isShowPercentSymbol={true}
// />
//  */

import { GlobalColor, GlobalFontStyle, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import {
  ImageSourcePropType,
  PanResponder,
  View,
  ViewStyle,
  StyleSheet,
  Text,
  GestureResponderEvent,
  PanResponderGestureState,
  Pressable,
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const TRACK_SIZE = 5
const THUMB_SIZE = 16
const MARGIN_HORIZONTAL = 16

function Rect(x, y, width, height) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
}

Rect.prototype.containsPoint = function (x, y) {
  return (
    x >= this.x &&
    y >= this.y &&
    x <= this.x + this.width &&
    y <= this.y + this.height
  )
}

const DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100,
  },
  timing: {
    duration: 150,
    // easing: Easing.inOut(Easing.ease),
    delay: 0,
  },
}

type Config = {
  /**
   * Initial value of the slider. The value should be between minimumValue
   * and maximumValue, which default to 0 and 1 respectively.
   * Default value is 0.
   *
   * *This is not a controlled component*, e.g. if you don't update
   * the value, the component won't be reset to its inital value.
   */
  value: number

  /**
   * If true the user won't be able to move the slider.
   * Default value is false.
   */
  disabled?: boolean
  /**
   * Initial minimum value of the slider. Default value is 0.
   */
  minimumValue: number
  /**
   * Initial maximum value of the slider. Default value is 1.
   */
  maximumValue: number
  /**
   * Step value of the slider. The value should be between 0 and
   * (maximumValue - minimumValue). Default value is 0.
   */
  step: number
  /**
   * The color used for the track to the left of the button. Overrides the
   * default blue gradient image.
   */
  minimumTrackTintColor?: string
  /**
   * The color used for the track to the right of the button. Overrides the
   * default blue gradient image.
   */
  maximumTrackTintColor?: string
  /**
   * The color used for the thumb.
   */
  thumbTintColor?: string
  /**
   * The size of the touch area that allows moving the thumb.
   * The touch area has the same center has the visible thumb.
   * This allows to have a visually small thumb while still allowing the user
   * to move it easily.
   * The default is {width: 40, height: 40}.
   */
  thumbTouchSize?: { width: number; height: number }
  /**
   * Callback continuously called while the user is dragging the slider.
   */
  onValueChange?: (value: number) => void
  /**
   * Callback called when the user starts changing the value (e.g. when
   * the slider is pressed).
   */
  onSlidingStart?: (value: number) => void
  /**
   * Callback called when the user finishes changing the value (e.g. when
   * the slider is released).
   */
  onSlidingComplete?: (value: number) => void
  /**
   * The style applied to the whole slider component.
   */
  styles?: ViewStyle
  /**
   * The style applied to the slider container.
   */
  style?: ViewStyle
  /**
   * The style applied to the track.
   */
  trackStyle?: ViewStyle
  /**
   * The style applied to the thumb.
   */
  thumbStyle?: ViewStyle
  /**
   * Sets an image for the thumb.
   */
  thumbImage?: ImageSourcePropType
  /**
   * Set to true to animate values with default 'timing' animation type
   */
  animateTransitions?: boolean
  /**
   * Custom Animation type. 'spring' or 'timing'.
   */
  animationType?: 'timing' | 'spring'
  /**
   * Used to configure the animation parameters.  These are the same parameters in the Animated library.
   */
  animationConfig?: Object
  /**
   *  显示%
   */
  isShowPercentSymbol: boolean
  /**
   * 显示刻度线数量
   */
  labelCount: number
  /**
   * 最大可用滑动值
   */
  maxAvailableValue: number
}

const SliderPicker = (config: Config) => {
  const { root } = useStore()
  const props = Object.assign(
    {
      value: 0,
      minimumValue: 0,
      maximumValue: 1,
      step: 0,
      minimumTrackTintColor: '#3f3f3f',
      maximumTrackTintColor: '#b3b3b3',
      thumbTintColor: '#343434',
      thumbTouchSize: { width: 16, height: 16 },
      debugTouchArea: false,
      isTextPercent: -1,
      animationType: 'timing',
      isShowPercentSymbol: false,
      labelCount: 0,
      maxAvailableValue: -1,
    },
    config,
  ) as Config

  const [pageLoading, setPageLoading] = useState(true)
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  })
  const [trackSize, setTrackSize] = useState({
    width: 0,
    height: 0,
  })
  const [thumbSize, setThumbSize] = useState({
    width: 0,
    height: 0,
  })
  const [allMeasured, setAllMeasured] = useState(false)

  const value = useSharedValue(props.value)
  const isShowLabel = useSharedValue(false)
  const scale = useSharedValue(1)
  const _panResponder = useRef(null)
  const _containerSize = useRef(null)
  const _trackSize = useRef(null)
  const _thumbSize = useRef(null)
  const _previousLeft = useRef(null)

  // life cycle
  useEffect(() => {
    _panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: _handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: _handleMoveShouldSetPanResponder,
      onPanResponderGrant: _handlePanResponderGrant,
      onPanResponderMove: _handlePanResponderMove,
      onPanResponderRelease: _handlePanResponderEnd,
      onPanResponderTerminationRequest: _handlePanResponderRequestEnd,
      onPanResponderTerminate: _handlePanResponderEnd,
    })

    if (_panResponder.current) {
      setPageLoading(false)
    }

    return () => {
      _panResponder.current = null
    }
  }, [_panResponder.current])

  // functions

  const _getPropsForComponentUpdate = (props) => {
    const {
      value,
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      style,
      trackStyle,
      thumbStyle,
      ...otherProps
    } = props

    return otherProps
  }

  const _handleStartShouldSetPanResponder = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) =>
    // Should we become active when the user presses down on the thumb?
    _thumbHitTest(e)

  const _handleMoveShouldSetPanResponder = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    // Should we become active when the user moves a touch over the thumb?
    return false
  }

  const _handlePanResponderGrant = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    _previousLeft.current = _getThumbLeft(_getCurrentValue())
    _fireChangeEvent('onSlidingStart')

    isShowLabel.value = true
    scale.value = 1.3
  }

  const _handlePanResponderMove = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (props.disabled) {
      return
    }

    const value = _getValue(gestureState)

    if (props.maxAvailableValue > 0 && value > props.maxAvailableValue) {
      return
    }

    _setCurrentValue(_getValue(gestureState))
    _fireChangeEvent('onValueChange')
  }

  const _handlePanResponderRequestEnd = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    // Should we allow another component to take over this pan?
    return false
  }

  const _handlePanResponderEnd = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (props.disabled) {
      return
    }

    // if (gestureState.dx === 0) {
    //   // 如果dx为0，则认为是点击事件，开始计算应该设置的值
    //   const dx =
    //     gestureState.x0 -
    //     this.props.thumbTouchSize.width / 2 -
    //     this._getThumbLeft(this._getCurrentValue()) -
    //     MARGIN_HORIZONTAL

    //   if (Math.abs(dx) > this.props.thumbTouchSize.width / 2) {
    //     // 点击了thumb之外的区域，需要设置值
    //     gestureState.dx = dx
    //     this._setCurrentValue(this._getValue(gestureState))
    //     this._fireChangeEvent('onSlidingComplete')
    //   }

    //   return
    // }

    const value = _getValue(gestureState)

    if (props.maxAvailableValue > 0 && value > props.maxAvailableValue) {
      isShowLabel.value = false
      scale.value = 1

      return
    }

    _setCurrentValue(_getValue(gestureState))
    _fireChangeEvent('onSlidingComplete')
    isShowLabel.value = false
    scale.value = 1
  }

  const _measureContainer = (x) => {
    _handleMeasure('containerSize', x)
  }

  const _measureTrack = (x) => {
    _handleMeasure('trackSize', x)
  }

  const _measureThumb = (x) => {
    _handleMeasure('thumbSize', x)
  }

  const getCurrentSize = (
    name: 'containerSize' | 'trackSize' | 'thumbSize',
  ) => {
    switch (name) {
      case 'containerSize':
        return _containerSize.current
      case 'trackSize':
        return _trackSize.current
      case 'thumbSize':
        return _thumbSize.current
      default:
        return null
    }
  }

  const setCurrentSize = (
    name: 'containerSize' | 'trackSize' | 'thumbSize',
    size: { width: number; height: number },
  ) => {
    switch (name) {
      case 'containerSize':
        _containerSize.current = size
        break
      case 'trackSize':
        _trackSize.current = size
        break
      case 'thumbSize':
        _thumbSize.current = size
        break
      default:
        break
    }
  }

  const _handleMeasure = (
    name: 'containerSize' | 'trackSize' | 'thumbSize',
    x,
  ) => {
    const { width, height } = x.nativeEvent.layout
    const size = { width, height }

    const currentSize = getCurrentSize(name)
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return
    }
    setCurrentSize(name, size)

    if (_containerSize.current && _trackSize.current && _thumbSize.current) {
      setContainerSize(Object.assign({}, _containerSize.current))
      setTrackSize(Object.assign({}, _trackSize.current))
      setThumbSize(Object.assign({}, _thumbSize.current))
      setAllMeasured(true)
    }
  }

  const _getRatio = (value: number) =>
    (value - props.minimumValue) / (props.maximumValue - props.minimumValue)

  const _getThumbLeft = (value: number) => {
    const ratio = _getRatio(value)
    return ratio * (_containerSize.current.width - _thumbSize.current.width)
  }

  const _getValue = (gestureState) => {
    const length = _containerSize.current.width - _thumbSize.current.width
    const thumbLeft = (_previousLeft.current ?? 0) + gestureState.dx

    const ratio = thumbLeft / length

    if (props.step) {
      return Math.max(
        props.minimumValue,
        Math.min(
          props.maximumValue,
          props.minimumValue +
            Math.round(
              (ratio * (props.maximumValue - props.minimumValue)) / props.step,
            ) *
              props.step,
        ),
      )
    }

    return Math.max(
      props.minimumValue,
      Math.min(
        props.maximumValue,
        ratio * (props.maximumValue - props.minimumValue) + props.minimumValue,
      ),
    )
  }

  const _getCurrentValue = () => value.value

  const _setCurrentValue = (newValue: number) => {
    value.value = newValue
  }

  const _fireChangeEvent = (event) => {
    if (props[event]) {
      props[event](_getCurrentValue())
    }
  }

  const _getTouchOverflowSize = () => {
    const size = { width: 0, height: 0 }
    if (allMeasured === true) {
      size.width = Math.max(0, props.thumbTouchSize.width - thumbSize.width)
      size.height = Math.max(
        0,
        props.thumbTouchSize.height - containerSize.height,
      )
    }

    return size
  }

  const _getTouchOverflowStyle = () => {
    const { width, height } = _getTouchOverflowSize()

    const touchOverflowStyle = {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    }
    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2
      touchOverflowStyle.marginTop = verticalMargin
      touchOverflowStyle.marginBottom = verticalMargin

      const horizontalMargin = -width / 2
      touchOverflowStyle.marginLeft = horizontalMargin
      touchOverflowStyle.marginRight = horizontalMargin
    }

    return touchOverflowStyle
  }

  const _thumbHitTest = (e) => {
    // open global catch
    return true

    // const nativeEvent = e.nativeEvent
    // const thumbTouchRect = this._getThumbTouchRect()

    // return thumbTouchRect.containsPoint(
    //   nativeEvent.locationX,
    //   nativeEvent.locationY,
    // )
  }

  const _getThumbTouchRect = () => {
    const touchOverflowSize = _getTouchOverflowSize()

    return new Rect(
      touchOverflowSize.width / 2 +
        _getThumbLeft(_getCurrentValue()) +
        (thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 +
        (containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height,
    )
  }

  // render calculator
  const mainStyles = props.styles || defaultStyles
  const thumbLeft = interpolate(
    value.value,
    [props.minimumValue, props.maximumValue],
    [-thumbSize.width / 2 + 4, containerSize.width - thumbSize.width / 2 - 4],
  )
  const minimumTrackWidth = interpolate(
    value.value,
    [props.minimumValue, props.maximumValue],
    [0, containerSize.width - thumbSize.width / 2],
  )
  const valueVisibleStyle = { opacity: allMeasured ? 1 : 0 }

  const animatedLabel = useAnimatedStyle(() => ({
    opacity: withTiming(isShowLabel.value ? 1 : 0, { duration: 100 }),
  }))

  const scaleValue = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 100 }) }],
  }))

  const minimumTrackStyle = {
    position: 'absolute',
    width: minimumTrackWidth + thumbSize.width / 2,
    backgroundColor: props.minimumTrackTintColor,
    ...valueVisibleStyle,
  }

  const renderLabel = () => {
    const arr = new Array(props.labelCount).fill(0)
    return arr.map((item, index) => {
      const step =
        (props.maximumValue - props.minimumValue) / (props.labelCount - 1)
      const value = Math.floor(step * index)

      const isBigger = props.value >= value

      return (
        <View
          key={'slider-render-label' + index}
          style={{
            // backgroundColor: 'green',
            alignItems: 'center',
            position: 'relative',
            top: 10,
          }}
        >
          <Pressable
            onPress={() => {
              if (
                props.maxAvailableValue > 0 &&
                value > props.maxAvailableValue
              ) {
                return
              }
              _setCurrentValue(value)
              _fireChangeEvent('onValueChange')
              _fireChangeEvent('onSlidingComplete')
            }}
            style={{
              width: 10,
              height: 20,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: isBigger ? '#FFF3CC' : '#EEEEEE',
                width: 8,
                height: 8,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: isBigger ? 'yellow' : 'black',
                  borderRadius: 2,
                }}
              />
            </View>
            <View
              style={{
                top: 2,
                width: 34,
              }}
            >
              <Text
                style={[
                  GlobalFontStyle(root.dark).NORMAL_12,
                  { color: GlobalColor(root.dark).BLACK, textAlign: 'center' },
                ]}
              >
                {value}
                {props.isShowPercentSymbol ? '%' : ''}
              </Text>
            </View>
          </Pressable>
        </View>
      )
    })
  }

  const touchOverflowStyle = _getTouchOverflowStyle()

  return pageLoading ? (
    <View>
      <Text>Loading...</Text>
    </View>
  ) : (
    <>
      <Animated.View
        // {...other}
        style={[
          mainStyles.container,
          // style,
          {
            width: '100%',
            marginHorizontal: MARGIN_HORIZONTAL,
          },
        ]}
        onLayout={_measureContainer}
      >
        <View
          style={[
            // { backgroundColor: maximumTrackTintColor },
            mainStyles.track,
            // trackStyle,
          ]}
          onLayout={_measureTrack}
        />
        <Animated.View
          style={[mainStyles.track, minimumTrackStyle]}
          // style={[mainStyles.track, trackStyle, minimumTrackStyle]}
        />
        <Animated.View
          onLayout={_measureThumb}
          style={[
            {
              zIndex: 1,
            },
            mainStyles.thumb,
            // thumbStyle,
            {
              transform: [{ translateX: thumbLeft }, { translateY: 0 }],
              ...valueVisibleStyle,
            },
          ]}
          {..._panResponder.current.panHandlers}
        ></Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -20,
              height: 20,
              width: 34,
            },
            {
              transform: [
                { translateX: thumbLeft - (34 - thumbSize.width) / 2 },
                { translateY: 0 },
              ],
            },
            animatedLabel,
          ]}
        >
          <Text
            style={[
              GlobalFontStyle(root.dark).NORMAL_18,
              { color: GlobalColor(root.dark).BLACK },
            ]}
          >
            {value.value}
          </Text>
        </Animated.View>

        {/* catch touch area */}
        <View
          style={[defaultStyles.touchArea, touchOverflowStyle]}
          {..._panResponder.current.panHandlers}
        />

        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
            },
            scaleValue,
          ]}
        >
          <Text
            style={[
              GlobalFontStyle(root.dark).NORMAL_22,
              { textAlign: 'center', color: GlobalColor(root.dark).BLACK },
            ]}
          >
            {value.value}
          </Text>
        </Animated.View>

        {props.labelCount > 0 && (
          <View
            style={[
              {
                position: 'absolute',
                width: containerSize.width,
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: 21,
              },
            ]}
          >
            {renderLabel()}
          </View>
        )}
      </Animated.View>
    </>
  )
}

const SliderPickerPage = ({ navigation }) => {
  const { root } = useStore()
  const [value, setValue] = useState(9)
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
      <Text
        style={[
          GlobalFontStyle(root.dark).NORMAL_18,
          { color: GlobalColor(root.dark).BLACK },
        ]}
      >
        Max Available: 50%
      </Text>
      <SliderPicker
        onValueChange={(value: number) => {
          setValue(value)
        }}
        onSlidingComplete={(value: number) => {
          setValue(value)
        }}
        minimumValue={0}
        maxAvailableValue={50}
        maximumValue={100}
        value={value}
        thumbTouchSize={{ width: 40, height: 40 }}
        step={1}
        trackStyle={{}}
        thumbStyle={{}}
        labelCount={5}
        isShowPercentSymbol={true}
      />
    </View>
  )
}

export default observer(SliderPickerPage)

const defaultStyles = StyleSheet.create({
  container: {
    height: 70,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
    borderWidth: 1,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFC300',
    borderWidth: 1,
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
