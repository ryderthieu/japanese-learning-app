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
      headerStyle: { backgroundColor: '#F490AF' },
      headerTitleStyle: { color: '#fff' },
      headerTintColor: '#fff'
    }}>
      <Stack.Screen name='MyCourse' component={LearningMaterials} options={{
        title: 'Khóa học của tôi',
        headerLeft: () => (
          <Icon
            name="menu-outline"
            size={24}
            color="#fff"
            onPress={() => navigation.openDrawer()}
            style={{
              marginRight: 20
            }}
          />
        ),
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