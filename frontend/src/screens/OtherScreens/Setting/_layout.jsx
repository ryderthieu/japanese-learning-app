import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from './Setting'
import EditAccount from './EditAccount'
import ChangePassword from './ChangePassword'


const SettingNavigation = ({navigation}) => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='Setting' component={Setting} options={{headerShown: false}} />
        <Stack.Screen name='EditAccount' component={EditAccount} options={{headerShown: false}}/>
        <Stack.Screen name='ChangePassword' component={ChangePassword} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

export default SettingNavigation