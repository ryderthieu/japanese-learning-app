import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from './Setting'
import ChangePassword from './ChangePassword'
import Icon from 'react-native-vector-icons/Ionicons'

const SettingNavigation = ({ navigation }) => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#F472B6',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      headerTitleStyle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
    }}>
      <Stack.Screen name='Setting' component={Setting} options={{
        title: 'Cài đặt',
      }} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ headerShown: true, title: 'Đổi mật khẩu' }} />
    </Stack.Navigator>
  )
}

export default SettingNavigation