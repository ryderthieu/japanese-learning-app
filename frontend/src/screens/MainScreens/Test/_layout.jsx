import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LevelSelect from './LevelSelect'
import TestSelect from './TestSelect'
import Test from './Test'
import TestResult from './TestResult'
import ReviewQuestions from './ReviewQuestions'
const TestStack = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='LevelSelect' component={LevelSelect}/>
        <Stack.Screen name='TestSelect' component={TestSelect}/>
        <Stack.Screen name='Test' component={Test}/>
        <Stack.Screen name='TestResult' component={TestResult}/>
        <Stack.Screen name='ReviewQuestions' component={ReviewQuestions}/>
    </Stack.Navigator>
  )
}

export default TestStack