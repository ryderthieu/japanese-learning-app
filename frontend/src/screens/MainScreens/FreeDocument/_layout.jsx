import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SelectVocabLesson from './SelectVocabLesson'
import SelectKanjiLesson from './SelectKanjiLesson'
import Vocab from './Vocab'
import Kanji from './Kanji'
import FreeDocumentAll1 from './FreeDocumentAll1'
import DocumentLevel from './DocumentLevel'

const FreeDocumentNavigation = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='DocumentLevel' component={DocumentLevel}/>
        <Stack.Screen name='SelectVocabLesson' component={SelectVocabLesson}/>
        <Stack.Screen name='SelectKanjiLesson' component={SelectKanjiLesson}/>
        <Stack.Screen name='Vocab' component={Kanji} options={{headerShown: false}}/>
        <Stack.Screen name='Kanji' component={Kanji} options={{headerShown: false}}/>
        <Stack.Screen name="FreeDocumentAll1" component={DocumentLevel} />
    </Stack.Navigator>
  )
}

export default FreeDocumentNavigation