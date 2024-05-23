import { StyleSheet } from 'react-native'

const GlobalColorLight = {
  PAGE_BACKGROUND: '#f5f5f5',
  BRANDING_BLUE: '#287dfa',
  BRANDING_ORANGE: '#ffb400',
  ORANGE: '#ff6f00',
  RED: '#ee3b28',
  CYAN: '#06aebd',
  BLACK: '#0f294d',
  SECOND_BLACK: '#455873',
  TERTIARY_BLACK: '#8592a6',
  GRAY: '#acb4bf',
}

const GlobalColorDark = {
  PAGE_BACKGROUND: '#1f2124',
  BRANDING_BLUE: '#7eb0fc',
  BRANDING_ORANGE: '#ffd266',
  ORANGE: '#ffa866',
  RED: '#f37668',
  CYAN: '#50c6d0',
  BLACK: '#ffffff',
  SECOND_BLACK: '#b8c4d4',
  TERTIARY_BLACK: '#99a6ba',
  GRAY: '#5c697c',
}

const GlobalColor = (dark: 'dark' | 'light' = 'light') => {
  return dark ? GlobalColorDark : GlobalColorLight
}

const GlobalSize = {
  PAGE_DEFAULT_PADDING: 16,
}

const GlobalFontStyle = (dark: 'dark' | 'light' = 'light') => {
  return dark === 'light'
    ? StyleSheet.create({
        NORMAL_10: {
          fontSize: 10,
          lineHeight: 14,
          color: GlobalColorDark.BLACK,
        },
        NORMAL_12: {
          fontSize: 12,
          lineHeight: 16,
          color: GlobalColorDark.BLACK,
        },
        NORMAL_14: {
          fontSize: 14,
          lineHeight: 18,
          color: GlobalColorDark.BLACK,
        },
        NORMAL_16: {
          fontSize: 16,
          lineHeight: 20,
          color: GlobalColorDark.BLACK,
        },
        NORMAL_18: {
          fontSize: 18,
          lineHeight: 22,
          color: GlobalColorDark.BLACK,
        },
        NORMAL_20: {
          fontSize: 20,
          lineHeight: 24,
          color: GlobalColorDark.BLACK,
        },
        NORMAL_22: {
          fontSize: 22,
          lineHeight: 26,
          color: GlobalColorDark.BLACK,
        },
      })
    : StyleSheet.create({
        NORMAL_10: {
          fontSize: 10,
          lineHeight: 14,
          color: GlobalColorLight.BLACK,
        },
        NORMAL_12: {
          fontSize: 12,
          lineHeight: 16,
          color: GlobalColorLight.BLACK,
        },
        NORMAL_14: {
          fontSize: 14,
          lineHeight: 18,
          color: GlobalColorLight.BLACK,
        },
        NORMAL_16: {
          fontSize: 16,
          lineHeight: 20,
          color: GlobalColorLight.BLACK,
        },
        NORMAL_18: {
          fontSize: 18,
          lineHeight: 22,
          color: GlobalColorLight.BLACK,
        },
        NORMAL_20: {
          fontSize: 20,
          lineHeight: 24,
          color: GlobalColorLight.BLACK,
        },
        NORMAL_22: {
          fontSize: 22,
          lineHeight: 26,
          color: GlobalColorLight.BLACK,
        },
      })
}

const GlobalStyle = (dark: 'dark' | 'light' = 'light') => {
  return dark === 'light'
    ? StyleSheet.create({
        page: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: GlobalSize.PAGE_DEFAULT_PADDING,
          backgroundColor: GlobalColorLight.PAGE_BACKGROUND,
        },
        animatedBox: {
          backgroundColor: GlobalColorLight.CYAN,
          width: 100,
          height: 100,
          borderRadius: 8,
        },
      })
    : StyleSheet.create({
        page: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: GlobalSize.PAGE_DEFAULT_PADDING,
          backgroundColor: GlobalColorDark.PAGE_BACKGROUND,
        },
        animatedBox: {
          backgroundColor: GlobalColorDark.CYAN,
          width: 100,
          height: 100,
          borderRadius: 8,
        },
      })
}

export {
  GlobalSize,
  GlobalColor,
  GlobalColorLight,
  GlobalColorDark,
  GlobalStyle,
  GlobalFontStyle,
}
