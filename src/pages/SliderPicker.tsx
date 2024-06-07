// /**
//  *
//  * usage:
//  * import Slider from '@/components/utils/Slider'
//  *
//  * <Slider
//   onValueChange={(value: number) => {}}
//   onSlidingComplete={(value: number) => {}}
//   minimumValue={0}
//   maxAvailableValue={25}
//   maximumValue={config?.maxInitialPosition}
//   value={currentType.initialPosition}
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
} from 'react-native'
import Animated, {
  interpolate,
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
  disabled: boolean
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
  onValueChange?: () => void
  /**
   * Callback called when the user starts changing the value (e.g. when
   * the slider is pressed).
   */
  onSlidingStart?: () => void
  /**
   * Callback called when the user finishes changing the value (e.g. when
   * the slider is released).
   */
  onSlidingComplete?: () => void
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
   * Set this to true to visually see the thumb touch rect in green.
   */
  debugTouchArea: boolean
  /**
   * Set to true to animate values with default 'timing' animation type
   */
  animateTransitions: boolean
  /**
   * Custom Animation type. 'spring' or 'timing'.
   */
  animationType: 'timing' | 'spring'
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

const SliderPicker = ({ navigation, config }) => {
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
  const [showTopLabel, setShowTopLabel] = useState(false)
  const [_previousLeft, _setPreviousLeft] = useState(0)
  const [store, setStore] = useState({
    containerSize: null,
    trackSize: null,
    thumbSize: null,
  })

  const value = useSharedValue(props.value)

  const _panResponder = useRef(null)

  // life cycle
  useEffect(() => {
    _panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: _handleStartShouldSetPanResponder,
    })

    console.log('_panResponder.current', _panResponder.current)

    return () => {
      _panResponder.current = null
    }
  }, [_panResponder.current])

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
      },
      headerTintColor: GlobalColor(root.dark).BLACK,
    })
  }, [navigation])

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
    _setPreviousLeft(_getThumbLeft(_getCurrentValue()))
    _fireChangeEvent('onSlidinStart')
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

    setShowTopLabel(true)
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
      setShowTopLabel(false)

      return
    }

    _setCurrentValue(_getValue(gestureState))
    _fireChangeEvent('onSlidingComplete')
    setShowTopLabel(false)
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

  const _handleMeasure = (
    name: 'containerSize' | 'trackSize' | 'thumbSize',
    x,
  ) => {
    const { width, height } = x.nativeEvent.layout
    const size = { width, height }

    const storeName = `_${name}`
    const currentSize = store[storeName]
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return
    }
    setStore({ ...store, [storeName]: size })

    const { containerSize, trackSize, thumbSize } = store

    if (containerSize && trackSize && thumbSize) {
      setContainerSize(containerSize)
      setTrackSize(trackSize)
      setThumbSize(thumbSize)
      setAllMeasured(true)
    }
  }

  const _getRatio = (value: number) =>
    (value - props.minimumValue) / (props.maximumValue - props.minimumValue)

  const _getThumbLeft = (value: number) => {
    const ratio = _getRatio(value)
    return ratio * (containerSize.width - thumbSize.width)
  }

  const _getValue = (gestureState) => {
    const length = containerSize.width - thumbSize.width
    const thumbLeft = _previousLeft + gestureState.dx

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
    withTiming(newValue)
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
    // 开启全局捕获
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
                  { color: 'black', textAlign: 'center' },
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

  console.log('_pan', _panResponder.current)

  return _panResponder.current ? (
    <View style={GlobalStyle(root.dark).page}>
      <>
        <View
          // {...other}
          style={[
            // mainStyles.container,
            // style,
            { marginHorizontal: MARGIN_HORIZONTAL },
          ]}
          onLayout={_measureContainer}
        >
          <View
            style={
              [
                // { backgroundColor: maximumTrackTintColor },
                // mainStyles.track,
                // trackStyle,
              ]
            }
            onLayout={_measureTrack}
          />
          <Animated.View
          // style={[mainStyles.track, trackStyle, minimumTrackStyle]}
          />
          <Animated.View
            onLayout={_measureThumb}
            style={[
              {
                // backgroundColor: thumbTintColor,
                zIndex: 1,
              },
              // mainStyles.thumb,
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
                top: -2,
                height: 20,
                width: 34,
                opacity: showTopLabel ? 1 : 0,
              },
              {
                transform: [
                  {
                    translateX: Animated.subtract(
                      thumbLeft,
                      (34 - thumbSize.width) / 2,
                    ),
                  },
                  { translateY: 0 },
                ],
                ...valueVisibleStyle,
              },
            ]}
          >
            {/* <ImageBackground
              style={{
                width: 34,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 2,
              }}
              source={getImgByName('slider_top_label')}
            >
              <Text
                style={[
                  AntQFontStyle.NORMAL_12,
                  { color: AntQColors.MAIN_BLACK, fontWeight: 'bold' },
                ]}
              >
                {_getCurrentValue().toFixed(0)}
                {props.isShowPercentSymbol ? '%' : ''}
              </Text>
            </ImageBackground> */}
          </Animated.View>

          {/* 滑动捕获实际区域 */}
          <View
            // style={[defaultStyles.touchArea, touchOverflowStyle]}
            {..._panResponder.current.panHandlers}
          />

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
        </View>
      </>
    </View>
  ) : (
    <View></View>
  )
}

export default observer(SliderPicker)
// import React, { PureComponent } from 'react'
// import {
//   Animated,
//   Image,
//   StyleSheet,
//   PanResponder,
//   View,
//   Easing,
//   ViewPropTypes,
//   I18nManager,
//   Text,
//   Pressable,
//   ImageBackground,
// } from 'react-native'

// import PropTypes from 'prop-types'
// import {
//   AntQColors,
//   AntQFontStyle,
//   AntQSizes,
// } from '@/componetsEx/DarkColorUtility'
// import { getImgByName } from '@/res/img'

// const TRACK_SIZE = 5
// const THUMB_SIZE = 16
// const MARGIN_HORIZONTAL = AntQSizes.PAGE_PADDING_DEFAULT

// function Rect(x, y, width, height) {
//   x = x
//   this.y = y
//   this.width = width
//   this.height = height
// }

// Rect.prototype.containsPoint = function (x, y) {
//   return (
//     x >= this.x &&
//     y >= this.y &&
//     x <= this.x + this.width &&
//     y <= this.y + this.height
//   )
// }

// const DEFAULT_ANIMATION_CONFIGS = {
//   spring: {
//     friction: 7,
//     tension: 100,
//   },
//   timing: {
//     duration: 150,
//     easing: Easing.inOut(Easing.ease),
//     delay: 0,
//   },
// }

// export default class Slider extends PureComponent {
//   static propTypes = {
//     /**
//      * Initial value of the slider. The value should be between minimumValue
//      * and maximumValue, which default to 0 and 1 respectively.
//      * Default value is 0.
//      *
//      * *This is not a controlled component*, e.g. if you don't update
//      * the value, the component won't be reset to its inital value.
//      */
//     value: number,

//     /**
//      * If true the user won't be able to move the slider.
//      * Default value is false.
//      */
//     disabled: boolean,

//     /**
//      * Initial minimum value of the slider. Default value is 0.
//      */
//     minimumValue: number,

//     /**
//      * Initial maximum value of the slider. Default value is 1.
//      */
//     maximumValue: number,

//     /**
//      * Step value of the slider. The value should be between 0 and
//      * (maximumValue - minimumValue). Default value is 0.
//      */
//     step: number,

//     /**
//      * The color used for the track to the left of the button. Overrides the
//      * default blue gradient image.
//      */
//     minimumTrackTintColor: string,

//     /**
//      * The color used for the track to the right of the button. Overrides the
//      * default blue gradient image.
//      */
//     maximumTrackTintColor: string,

//     /**
//      * The color used for the thumb.
//      */
//     thumbTintColor: string,

//     /**
//      * The size of the touch area that allows moving the thumb.
//      * The touch area has the same center has the visible thumb.
//      * This allows to have a visually small thumb while still allowing the user
//      * to move it easily.
//      * The default is {width: 40, height: 40}.
//      */
//     thumbTouchSize: PropTypes.shape({
//       width: number,
//       height: number,
//     }),

//     /**
//      * Callback continuously called while the user is dragging the slider.
//      */
//     onValueChange: () => void,

//     /**
//      * Callback called when the user starts changing the value (e.g. when
//      * the slider is pressed).
//      */
//     onSlidingStart: () => void,

//     /**
//      * Callback called when the user finishes changing the value (e.g. when
//      * the slider is released).
//      */
//     onSlidingComplete: () => void,

//     /**
//      * The style applied to the slider container.
//      */
//     style: ViewStyle,

//     /**
//      * The style applied to the track.
//      */
//     trackStyle: ViewStyle,

//     /**
//      * The style applied to the thumb.
//      */
//     thumbStyle: ViewStyle,

//     /**
//      * Sets an image for the thumb.
//      */
//     thumbImage: Image.propTypes.source,

//     /**
//      * Set this to true to visually see the thumb touch rect in green.
//      */
//     debugTouchArea: boolean,

//     /**
//      * Set to true to animate values with default 'timing' animation type
//      */
//     animateTransitions: boolean,

//     /**
//      * Custom Animation type. 'spring' or 'timing'.
//      */
//     animationType: PropTypes.oneOf(['spring', 'timing']),

//     /**
//      * Used to configure the animation parameters.  These are the same parameters in the Animated library.
//      */
//     animationConfig: PropTypes.object,

//     /**
//      *  显示%
//      */
//     isShowPercentSymbol: boolean,

//     /**
//      * 显示刻度线数量
//      */
//     labelCount: number,

//     /**
//      * 最大可用滑动值
//      */
//     maxAvailableValue: number,
//   }

//   static defaultProps = {
//     value: 0,
//     minimumValue: 0,
//     maximumValue: 1,
//     step: 0,
//     minimumTrackTintColor: '#3f3f3f',
//     maximumTrackTintColor: '#b3b3b3',
//     thumbTintColor: '#343434',
//     thumbTouchSize: { width: 16, height: 16 },
//     debugTouchArea: false,
//     isTextPercent: -1,
//     animationType: 'timing',
//     isShowPercentSymbol: false,
//     labelCount: 0,
//     maxAvailableValue: -1,
//   }

//   state = {
//     containerSize: { width: 0, height: 0 },
//     trackSize: { width: 0, height: 0 },
//     thumbSize: { width: 0, height: 0 },
//     allMeasured: false,
//     value: new Animated.Value(this.props.value),
//     showTopLabel: false,
//   }

//   UNSAFE_componentWillMount() {
//     this._panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
//       onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
//       onPanResponderGrant: this._handlePanResponderGrant,
//       onPanResponderMove: this._handlePanResponderMove,
//       onPanResponderRelease: this._handlePanResponderEnd,
//       onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
//       onPanResponderTerminate: this._handlePanResponderEnd,
//     })
//   }

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     const newValue = nextProps.value

//     if (this.props.value !== newValue) {
//       if (this.props.animateTransitions) {
//         this._setCurrentValueAnimated(newValue)
//       } else {
//         this._setCurrentValue(newValue)
//       }
//     }
//   }

//   render() {
//     const {
//       minimumValue,
//       maximumValue,
//       minimumTrackTintColor,
//       maximumTrackTintColor,
//       thumbTintColor,
//       thumbImage,
//       styles,
//       style,
//       trackStyle,
//       thumbStyle,
//       debugTouchArea,
//       onValueChange,
//       thumbTouchSize,
//       animationType,
//       animateTransitions,
//       ...other
//     } = this.props
//     const { value, containerSize, trackSize, thumbSize, allMeasured } =
//       this.state
//     const mainStyles = styles || defaultStyles
//     const thumbLeft = value.interpolate({
//       inputRange: [minimumValue, maximumValue],
//       outputRange: I18nManager.isRTL
//         ? [
//             -thumbSize.width / 2 + 4,
//             -(containerSize.width - thumbSize.width / 2 - 4),
//           ]
//         : [
//             -thumbSize.width / 2 + 4,
//             containerSize.width - thumbSize.width / 2 - 4,
//           ],
//       // extrapolate: 'clamp',
//     })
//     const minimumTrackWidth = value.interpolate({
//       inputRange: [minimumValue, maximumValue],
//       outputRange: [0, containerSize.width - thumbSize.width / 2],
//       // extrapolate: 'clamp',
//     })
//     const valueVisibleStyle = {}
//     if (!allMeasured) {
//       valueVisibleStyle.opacity = 0
//     }

//     const minimumTrackStyle = {
//       position: 'absolute',
//       width: Animated.add(minimumTrackWidth, thumbSize.width / 2),
//       backgroundColor: minimumTrackTintColor,
//       ...valueVisibleStyle,
//     }

//     const renderLabel = () => {
//       const arr = new Array(this.props.labelCount).fill(0)
//       return arr.map((item, index) => {
//         const step =
//           (this.props.maximumValue - this.props.minimumValue) /
//           (this.props.labelCount - 1)
//         const value = Math.floor(step * index)

//         const isBigger = this.props.value >= value

//         return (
//           <View
//             key={'slider-render-label' + index}
//             style={{
//               // backgroundColor: 'green',
//               alignItems: 'center',
//               position: 'relative',
//             }}
//           >
//             <Pressable
//               onPress={() => {
//                 if (
//                   this.props.maxAvailableValue > 0 &&
//                   value > this.props.maxAvailableValue
//                 ) {
//                   return
//                 }
//                 this._setCurrentValue(value)
//                 this._fireChangeEvent('onValueChange')
//                 this._fireChangeEvent('onSlidingComplete')
//               }}
//               style={{
//                 width: 10,
//                 height: 20,
//                 alignItems: 'center',
//               }}
//             >
//               <View
//                 style={{
//                   backgroundColor: isBigger
//                     ? '#FFF3CC'
//                     : AntQColors.TEXTINPUT_BORDER_COLOR,
//                   width: 8,
//                   height: 8,
//                   borderRadius: 4,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//               >
//                 <View
//                   style={{
//                     width: 4,
//                     height: 4,
//                     backgroundColor: isBigger
//                       ? AntQColors.MAIN_YELLOW
//                       : AntQColors.MAIN_BLACK,
//                     borderRadius: 2,
//                   }}
//                 />
//               </View>
//               <View
//                 style={{
//                   top: 2,
//                   width: 34,
//                 }}
//               >
//                 <Text
//                   style={[
//                     AntQFontStyle.NORMAL_12,
//                     { color: AntQColors.MAIN_BLACK9, textAlign: 'center' },
//                   ]}
//                 >
//                   {value}
//                   {this.props.isShowPercentSymbol ? '%' : ''}
//                 </Text>
//               </View>
//             </Pressable>
//           </View>
//         )
//       })
//     }

//     const touchOverflowStyle = this._getTouchOverflowStyle()
//     return (
//       <>
//         <View
//           {...other}
//           style={[
//             mainStyles.container,
//             style,
//             { marginHorizontal: MARGIN_HORIZONTAL },
//           ]}
//           onLayout={this._measureContainer}
//         >
//           <View
//             style={[
//               { backgroundColor: maximumTrackTintColor },
//               mainStyles.track,
//               trackStyle,
//             ]}
//             onLayout={this._measureTrack}
//           />
//           <Animated.View
//             style={[mainStyles.track, trackStyle, minimumTrackStyle]}
//           />
//           <Animated.View
//             onLayout={this._measureThumb}
//             style={[
//               {
//                 backgroundColor: thumbTintColor,
//                 zIndex: 1,
//               },
//               mainStyles.thumb,
//               thumbStyle,
//               {
//                 transform: [{ translateX: thumbLeft }, { translateY: 0 }],
//                 ...valueVisibleStyle,
//               },
//             ]}
//             {...this._panResponder.panHandlers}
//           ></Animated.View>

//           <Animated.View
//             style={[
//               {
//                 position: 'absolute',
//                 top: -2,
//                 height: 20,
//                 width: 34,
//                 opacity: this.state.showTopLabel ? 1 : 0,
//               },
//               {
//                 transform: [
//                   {
//                     translateX: Animated.subtract(
//                       thumbLeft,
//                       (34 - this.state.thumbSize.width) / 2
//                     ),
//                   },
//                   { translateY: 0 },
//                 ],
//                 ...valueVisibleStyle,
//               },
//             ]}
//           >
//             <ImageBackground
//               style={{
//                 width: 34,
//                 height: 18,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 paddingBottom: 2,
//               }}
//               source={getImgByName('slider_top_label')}
//             >
//               <Text
//                 style={[
//                   AntQFontStyle.NORMAL_12,
//                   { color: AntQColors.MAIN_BLACK, fontWeight: 'bold' },
//                 ]}
//               >
//                 {this._getCurrentValue().toFixed(0)}
//                 {this.props.isShowPercentSymbol ? '%' : ''}
//               </Text>
//             </ImageBackground>
//           </Animated.View>

//           {/* 滑动捕获实际区域 */}
//           <View
//             style={[defaultStyles.touchArea, touchOverflowStyle]}
//             {...this._panResponder.panHandlers}
//           />

//           {this.props.labelCount > 0 && (
//             <View
//               style={[
//                 {
//                   position: 'absolute',
//                   width: this.state.containerSize.width,
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   top: 21,
//                 },
//               ]}
//             >
//               {renderLabel()}
//             </View>
//           )}
//         </View>
//       </>
//     )
//   }

//   _getPropsForComponentUpdate(props) {
//     const {
//       value,
//       onValueChange,
//       onSlidingStart,
//       onSlidingComplete,
//       style,
//       trackStyle,
//       thumbStyle,
//       ...otherProps
//     } = props

//     return otherProps
//   }

//   _handleStartShouldSetPanResponder = (e /* gestureState: Object */) =>
//     // Should we become active when the user presses down on the thumb?
//     this._thumbHitTest(e)

//   _handleMoveShouldSetPanResponder(/* e: Object, gestureState: Object */) {
//     // Should we become active when the user moves a touch over the thumb?
//     return false
//   }

//   _handlePanResponderGrant = (e, gestureState) => {
//     this._previousLeft = this._getThumbLeft(this._getCurrentValue())
//     this._fireChangeEvent('onSlidinStart')
//   }

//   _handlePanResponderMove = (e, gestureState) => {
//     if (this.props.disabled) {
//       return
//     }

//     const value = this._getValue(gestureState)

//     if (
//       this.props.maxAvailableValue > 0 &&
//       value > this.props.maxAvailableValue
//     ) {
//       return
//     }

//     this._setCurrentValue(this._getValue(gestureState))
//     this._fireChangeEvent('onValueChange')

//     this.setState({ showTopLabel: true })
//   }

//   _handlePanResponderRequestEnd(e, gestureState) {
//     // Should we allow another component to take over this pan?
//     return false
//   }

//   _handlePanResponderEnd = (e, gestureState) => {
//     if (this.props.disabled) {
//       return
//     }

//     // if (gestureState.dx === 0) {
//     //   // 如果dx为0，则认为是点击事件，开始计算应该设置的值
//     //   const dx =
//     //     gestureState.x0 -
//     //     this.props.thumbTouchSize.width / 2 -
//     //     this._getThumbLeft(this._getCurrentValue()) -
//     //     MARGIN_HORIZONTAL

//     //   if (Math.abs(dx) > this.props.thumbTouchSize.width / 2) {
//     //     // 点击了thumb之外的区域，需要设置值
//     //     gestureState.dx = dx
//     //     this._setCurrentValue(this._getValue(gestureState))
//     //     this._fireChangeEvent('onSlidingComplete')
//     //   }

//     //   return
//     // }

//     const value = this._getValue(gestureState)

//     if (
//       this.props.maxAvailableValue > 0 &&
//       value > this.props.maxAvailableValue
//     ) {
//       this.setState({ showTopLabel: false })

//       return
//     }

//     this._setCurrentValue(this._getValue(gestureState))
//     this._fireChangeEvent('onSlidingComplete')

//     this.setState({ showTopLabel: false })
//   }

//   _measureContainer = (x) => {
//     this._handleMeasure('containerSize', x)
//   }

//   _measureTrack = (x) => {
//     this._handleMeasure('trackSize', x)
//   }

//   _measureThumb = (x) => {
//     this._handleMeasure('thumbSize', x)
//   }

//   _handleMeasure = (name, x) => {
//     const { width, height } = x.nativeEvent.layout
//     const size = { width, height }

//     const storeName = `_${name}`
//     const currentSize = this[storeName]
//     if (
//       currentSize &&
//       width === currentSize.width &&
//       height === currentSize.height
//     ) {
//       return
//     }
//     this[storeName] = size

//     if (this._containerSize && this._trackSize && this._thumbSize) {
//       this.setState({
//         containerSize: this._containerSize,
//         trackSize: this._trackSize,
//         thumbSize: this._thumbSize,
//         allMeasured: true,
//       })
//     }
//   }

//   _getRatio = (value) =>
//     (value - this.props.minimumValue) /
//     (this.props.maximumValue - this.props.minimumValue)

//   _getThumbLeft = (value) => {
//     const nonRtlRatio = this._getRatio(value)
//     const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio
//     return ratio * (this.state.containerSize.width - this.state.thumbSize.width)
//   }

//   _getValue = (gestureState) => {
//     const length = this.state.containerSize.width - this.state.thumbSize.width
//     const thumbLeft = this._previousLeft + gestureState.dx

//     const nonRtlRatio = thumbLeft / length
//     const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio

//     if (this.props.step) {
//       return Math.max(
//         this.props.minimumValue,
//         Math.min(
//           this.props.maximumValue,
//           this.props.minimumValue +
//             Math.round(
//               (ratio * (this.props.maximumValue - this.props.minimumValue)) /
//                 this.props.step
//             ) *
//               this.props.step
//         )
//       )
//     }
//     return Math.max(
//       this.props.minimumValue,
//       Math.min(
//         this.props.maximumValue,
//         ratio * (this.props.maximumValue - this.props.minimumValue) +
//           this.props.minimumValue
//       )
//     )
//   }

//   _getCurrentValue = () => this.state.value.__getValue()

//   _setCurrentValue = (value) => {
//     this.state.value.setValue(value)
//   }

//   _setCurrentValueAnimated = (value) => {
//     const animationType = this.props.animationType
//     const animationConfig = Object.assign(
//       {},
//       DEFAULT_ANIMATION_CONFIGS[animationType],
//       this.props.animationConfig,
//       {
//         toValue: value,
//       }
//     )

//     Animated[animationType](this.state.value, animationConfig).start()
//   }

//   _fireChangeEvent = (event) => {
//     if (this.props[event]) {
//       this.props[event](this._getCurrentValue())
//     }
//   }

//   _getTouchOverflowSize = () => {
//     const state = this.state
//     const props = this.props

//     const size = {}
//     if (state.allMeasured === true) {
//       size.width = Math.max(
//         0,
//         props.thumbTouchSize.width - state.thumbSize.width
//       )
//       size.height = Math.max(
//         0,
//         props.thumbTouchSize.height - state.containerSize.height
//       )
//     }

//     return size
//   }

//   _getTouchOverflowStyle = () => {
//     const { width, height } = this._getTouchOverflowSize()

//     const touchOverflowStyle = {}
//     if (width !== undefined && height !== undefined) {
//       const verticalMargin = -height / 2
//       touchOverflowStyle.marginTop = verticalMargin
//       touchOverflowStyle.marginBottom = verticalMargin

//       const horizontalMargin = -width / 2
//       touchOverflowStyle.marginLeft = horizontalMargin
//       touchOverflowStyle.marginRight = horizontalMargin
//     }

//     return touchOverflowStyle
//   }

//   _thumbHitTest = (e) => {
//     // 开启全局捕获
//     return true

//     const nativeEvent = e.nativeEvent
//     const thumbTouchRect = this._getThumbTouchRect()

//     return thumbTouchRect.containsPoint(
//       nativeEvent.locationX,
//       nativeEvent.locationY
//     )
//   }

//   _getThumbTouchRect = () => {
//     const state = this.state
//     const props = this.props
//     const touchOverflowSize = this._getTouchOverflowSize()

//     return new Rect(
//       touchOverflowSize.width / 2 +
//         this._getThumbLeft(this._getCurrentValue()) +
//         (state.thumbSize.width - props.thumbTouchSize.width) / 2,
//       touchOverflowSize.height / 2 +
//         (state.containerSize.height - props.thumbTouchSize.height) / 2,
//       props.thumbTouchSize.width,
//       props.thumbTouchSize.height
//     )
//   }
// }

const defaultStyles = StyleSheet.create({
  container: {
    height: 50,
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
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5,
  },
})
