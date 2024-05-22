import { StyleSheet } from 'react-native'

const GlobalColor = {
  MAIN_BLACK: '#333333',
  MAIN_WHITE: '#FFFFFF',
  MAIN_YELLOW: '#ffd33d',
  BUTTON_BG: '#57bcf7',
}

const GlobalSize = {
  PAGE_DEFAULT_PADDING: 16,
}

const GlobalFontStyle = StyleSheet.create({
  NORMAL_10: { fontSize: 10, lineHeight: 14, color: GlobalColor.MAIN_BLACK },
  NORMAL_10_WHITE: {
    fontSize: 10,
    lineHeight: 14,
    color: GlobalColor.MAIN_WHITE,
  },
  NORMAL_12: { fontSize: 12, lineHeight: 16, color: GlobalColor.MAIN_BLACK },
  NORMAL_12_WHITE: {
    fontSize: 12,
    lineHeight: 16,
    color: GlobalColor.MAIN_WHITE,
  },
  NORMAL_14: { fontSize: 14, lineHeight: 18, color: GlobalColor.MAIN_BLACK },
  NORMAL_14_WHITE: {
    fontSize: 14,
    lineHeight: 18,
    color: GlobalColor.MAIN_WHITE,
  },
  NORMAL_16: { fontSize: 16, lineHeight: 20, color: GlobalColor.MAIN_BLACK },
  NORMAL_16_WHITE: {
    fontSize: 16,
    lineHeight: 20,
    color: GlobalColor.MAIN_WHITE,
  },
  NORMAL_18: { fontSize: 18, lineHeight: 22, color: GlobalColor.MAIN_BLACK },
  NORMAL_18_WHITE: {
    fontSize: 18,
    lineHeight: 22,
    color: GlobalColor.MAIN_WHITE,
  },
  NORMAL_20: { fontSize: 20, lineHeight: 24, color: GlobalColor.MAIN_BLACK },
  NORMAL_20_WHITE: {
    fontSize: 20,
    lineHeight: 24,
    color: GlobalColor.MAIN_WHITE,
  },
  NORMAL_22: { fontSize: 22, lineHeight: 26, color: GlobalColor.MAIN_BLACK },
})

const GlobalStyle = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: GlobalSize.PAGE_DEFAULT_PADDING,
  },
})

export { GlobalSize, GlobalStyle, GlobalColor, GlobalFontStyle }
