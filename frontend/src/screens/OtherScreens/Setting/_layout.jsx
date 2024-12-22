import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from './Setting'
import ChangePassword from './ChangePassword'
import Icon from 'react-native-vector-icons/Ionicons'

const SettingNavigation = ({ navigation }) => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {backgroundColor: '#F490AF'},
      headerTitleStyle: {color: '#fff'},
      headerTintColor: '#fff',

    }}>
      <Stack.Screen name='Setting' component={Setting} options={{
        title: 'Cài đặt',
        headerLeft: () => (
          <Icon
            name='menu'
            size={24}
            onPress={() => navigation.openDrawer()}
            className='mr-[20px]'
            color={'white'}
          />
        )
      }} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: true, title: 'Đổi mật khẩu' }} />
    </Stack.Navigator>
  )
}

export default SettingNavigation