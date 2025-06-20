import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LearningMaterials from './MyCourse'
import Lessons from './Lessons'
import LessonDetail from './LessonDetail'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
const DocumentStack = () => {
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
      <Stack.Screen name='MyCourse' component={LearningMaterials} options={{
        title: 'Khóa học của tôi',
      }} />
      <Stack.Screen name='Lessons' component={Lessons} options={({ route }) => ({
        title: route.params?.course.title || 'Danh sách bài học'
      })} />
      <Stack.Screen name='LessonDetail' component={LessonDetail} options={({ route }) => ({
        title: route.params?.lesson.title || 'Chi tiết bài học'
      })} />
    </Stack.Navigator>
  )
}

export default DocumentStack