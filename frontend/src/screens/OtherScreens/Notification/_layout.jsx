import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Notification from './Notification'
import NotificationDetails from './NotificationDetails'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const NotificationNavigation = () => {
    const Stack = createNativeStackNavigator()
    const navigation = useNavigation()
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
        <Stack.Screen name='Notification' component={Notification} options={{
            title: 'Thông báo',
        }}/>
        <Stack.Screen name='NotificationDetails' component={NotificationDetails} options={({route}) => ({
            title: route.params?.notification.title,
        })}/>
    </Stack.Navigator>
  )
}

export default NotificationNavigation