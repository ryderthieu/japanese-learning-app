import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './Home'
import FreeDocumentNavigation from '../FreeDocument/_layout'

const HomeNavigation = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='FreeDocumentNavigation' component={FreeDocumentNavigation}/>
    </Stack.Navigator>
  )
}

export default HomeNavigation