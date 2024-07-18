// if you want to cover the "Stack Navigation Header"
// please use react-native-root-siblings
import Button from '@/components/Button'
import DrawerHOC from '@/components/DrawerHOC'
import { GlobalColor, GlobalSize, GlobalStyle } from '@/global/style'
import useStore from '@/store'
import { hp, wp } from '@/utils'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DrawerAnimation = ({ navigation }) => {
  const [show, setShow] = useState(true)
  const { root } = useStore()

  const MyDrawer = DrawerHOC(
    ({ onClose }) => (
      <View
        style={{
          backgroundColor: GlobalColor(root.dark).PAGE_BACKGROUND,
          height: hp(61),
          width: wp(100),
          padding: GlobalSize.PAGE_DEFAULT_PADDING,
        }}
      >
        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{ color: GlobalColor(root.dark).BLACK }}
            onPress={() => {
              onClose(() => {
                setShow(false)
              })
            }}
          >
            X
          </Text>
        </View>
        <Text style={{ color: GlobalColor(root.dark).BLACK }}>Hi There</Text>
        <SafeAreaView />
      </View>
    ),
    {
      dark: root.dark,
      duration: 300,
      styles: { drawer: { borderTopLeftRadius: 8, borderTopRightRadius: 8 } },
    },
  )

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
      <Button
        onPress={() => {
          setShow(true)
        }}
        label="Open Modal"
      />

      {show && <MyDrawer />}
    </View>
  )
}

export default observer(DrawerAnimation)
