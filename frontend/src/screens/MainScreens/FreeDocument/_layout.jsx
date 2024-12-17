import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FreeDocument from './FreeDocument'
import Vocab from './Vocab'
import Kanji from './Kanji'
import FreeDocumentAll1 from './FreeDocumentAll1'

const FreeDocumentNavigation = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='FreeDocument' component={FreeDocument}/>
        <Stack.Screen name='Vocab' component={Vocab}/>
        <Stack.Screen name='Kanji' component={Kanji}/>
        <Stack.Screen name="FreeDocumentAll1" component={FreeDocumentAll1} />
    </Stack.Navigator>
  )
}

export default FreeDocumentNavigation