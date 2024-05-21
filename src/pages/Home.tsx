import { StatusBar } from 'expo-status-bar'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

const Home = ({ navigation }) => {
  return (
    <ScrollView
      style={{
        width: '100%',
        flex: 1,
        padding: 16,
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: 'yellow',
          width: '100%',
          padding: 16,
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('First')}
      >
        <Text>Test</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </ScrollView>
  )
}

export default Home
