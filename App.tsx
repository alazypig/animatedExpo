import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '@/pages/Home'
import { PageConfig } from '@/pages/config'
import { StoreProvider } from '@/store'

// if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          {Object.keys(PageConfig).map((key) => (
            <Stack.Screen key={key} name={key} component={PageConfig[key]} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  )
}
