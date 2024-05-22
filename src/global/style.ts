import { StyleSheet } from 'react-native'

const GlobalColor = {}

const GlobalSize = {
  PAGE_DEFAULT_PADDING: 16,
}

const GlobalStyle = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: GlobalSize.PAGE_DEFAULT_PADDING,
  },
})

export { GlobalSize, GlobalStyle }
