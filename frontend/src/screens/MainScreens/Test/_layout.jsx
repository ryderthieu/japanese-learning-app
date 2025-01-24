import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LevelSelect from './LevelSelect'
import TestSelect from './TestSelect'
import Test from './Test'
import TestResult from './TestResult'
import ReviewQuestions from './ReviewQuestions'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
const TestStack = () => {
  const Stack = createNativeStackNavigator()
  const navigation = useNavigation()
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#F490AF' },
      headerTitleStyle: { color: '#fff' },
      headerTintColor: '#fff'
    }}>
      <Stack.Screen name='LevelSelect' component={LevelSelect} options={{
        title: 'Thi thử',
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
      <Stack.Screen name='TestSelect' component={TestSelect} options={{
        title: 'Chọn đề thi'
      }} />
      <Stack.Screen name='Test' component={Test} options={(route) => ({
        title: 'Kiểm tra'
      })} />
      <Stack.Screen name='TestResult' component={TestResult} options={{
        title: 'Kết quả',
        headerShown: false
      }} />
      <Stack.Screen name='ReviewQuestions' component={ReviewQuestions} options={{
        title: 'Xem lại'
      }} />
    </Stack.Navigator>
  )
}

export default TestStack