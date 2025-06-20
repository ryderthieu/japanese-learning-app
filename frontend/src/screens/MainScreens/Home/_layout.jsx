import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './Home'
import FreeDocumentNavigation from '../FreeDocument/_layout'
import SurveyNavigation from '../Survey/_layout'
import CoursesNavigation from '../Courses/_layout'
import Dictionary from '../Dictionary/Dictionary'
import Icon from 'react-native-vector-icons/Ionicons'
import { useEffect } from 'react'
import SavedVocabulary from './SavedVocabulary'
import SavedGrammar from './SavedGrammar'

const HomeNavigation = ({ navigation, route }) => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { 
              backgroundColor: '#F472B6',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: { 
              color: '#fff', 
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name='Home' component={Home} options={{
              title: 'Trang chủ',
            }} />
            <Stack.Screen name='FreeDocumentNavigation' component={FreeDocumentNavigation} options={{ headerShown: false }} />
            <Stack.Screen name='SurveyNavigation' component={SurveyNavigation} options={{ headerShown: false }} />
            <Stack.Screen name='CoursesNavigation' component={CoursesNavigation} options={{ headerShown: false }} />
            <Stack.Screen name='Dictionary' component={Dictionary} options={{ title: 'Từ điển' }} />
            <Stack.Screen name='SavedVocabulary' component={SavedVocabulary} options={{ title: 'Từ vựng đã lưu' }} />
            <Stack.Screen name='SavedGrammar' component={SavedGrammar} options={{ title: 'Ngữ pháp đã lưu' }} />

        </Stack.Navigator>
    )
}

export default HomeNavigation