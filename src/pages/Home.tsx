import Button from '@/components/Button'
import { GlobalSize } from '@/global/style'
import { StatusBar } from 'expo-status-bar'
import { View, ScrollView } from 'react-native'
import { PageConfig } from './config'

const Home = ({ navigation }) => {
  return (
    <ScrollView
      style={{
        width: '100%',
        flex: 1,
        padding: 16,
      }}
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
    </ScrollView>
  )
}

export default Home
