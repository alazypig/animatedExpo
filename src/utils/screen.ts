import { Dimensions, Platform, NativeModules } from 'react-native'

const { width: VW, height: VH } = Dimensions.get('window')

// consider about the whole screen
const trueViewportHeight = (): number => {
  const { StatusBarManager } = NativeModules

  const H =
    Platform.OS === 'ios'
      ? Dimensions.get('window').height
      : Dimensions.get('window').height / Dimensions.get('window').width > 1.8
        ? Dimensions.get('window').height + StatusBarManager.HEIGHT * 2
        : Dimensions.get('window').height

  return H
}

export const wp = (percent: number): number => {
  const value = (percent * VW) / 100

  return Math.round(value)
}

export const hp = (percent: number): number => {
  const value = (percent * trueViewportHeight()) / 100

  return Math.round(value)
}
