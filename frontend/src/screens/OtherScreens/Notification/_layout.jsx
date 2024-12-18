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
    <Stack.Navigator>
        <Stack.Screen name='Notification' component={Notification} options={{
            headerLeft: () => (
                <Icon name='menu' size = {24} color={'#fff'} className='mr-[20px]' onPress={() => navigation.openDrawer()}/>
            ),
            title: 'Thông báo',
            headerStyle: {backgroundColor: '#F490AF'},
            headerTitleStyle: {color: '#fff'},
        }}/>
        <Stack.Screen name='NotificationDetails' component={NotificationDetails} options={({route}) => ({
            headerTintColor: '#fff',
            title: route.params?.notification.title,
            headerStyle: {backgroundColor: '#F490AF'},
            headerTitleStyle: {color: '#fff'},
        })}/>
    </Stack.Navigator>
  )
}

export default NotificationNavigation