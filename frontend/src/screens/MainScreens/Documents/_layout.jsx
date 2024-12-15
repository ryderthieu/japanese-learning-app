import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LearningMaterials from './MyCourse'
import Lessons from './Lessons'
import LessonDetail from './LessonDetail'
const DocumentStack = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='MyCourse' component={LearningMaterials} options={{
          title: 'Khóa học của tôi'
        }}/>
        <Stack.Screen name='Lessons' component={Lessons} options={({route}) => ({
          title: route.params?.course.title || 'Danh sách bài học'
        })}/>
        <Stack.Screen name='LessonDetail' component={LessonDetail} options={({route}) => ({
          title: route.params?.lesson.title || 'Chi tiết bài học'
        })}/>
    </Stack.Navigator>
  )
}

export default DocumentStack