import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LearningMaterials from './MyCourse'
import Lessons from './Lessons'
import LessonDetail from './LessonDetail'
const DocumentStack = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='MyCourse' component={LearningMaterials}/>
        <Stack.Screen name='Lessons' component={Lessons}/>
        <Stack.Screen name='LessonDetail' component={LessonDetail} />
    </Stack.Navigator>
  )
}

export default DocumentStack