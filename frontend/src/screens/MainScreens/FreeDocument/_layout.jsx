import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SelectVocabLesson from './SelectVocabLesson'
import SelectKanjiLesson from './SelectKanjiLesson'
import SelectGrammarLesson from './SelectGrammarLesson'
import DocumentLevel from './DocumentLevel'
import Test from './Test'
import { Icon } from '@rneui/themed'
import { TouchableOpacity, Text } from 'react-native'
import GrammarLessonDetail from './GrammarLessonDetail'
import VocabularyLessonDetail from './VocabularyLessonDetail'

const FreeDocumentNavigation = ({ navigation }) => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { 
        backgroundColor: '#F472B6',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      headerTitleStyle: { 
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
    }}>
      <Stack.Screen name='DocumentLevel' component={DocumentLevel} options={{
        headerShown: true,
        title: 'Tài liệu miễn phí',
      }}
      />
      <Stack.Screen name='SelectVocabLesson' component={SelectVocabLesson} options={{ title: 'Danh sách bài học từ vựng' }} />
      <Stack.Screen name='SelectKanjiLesson' component={SelectKanjiLesson} options={{ title: 'Danh sách bài học kanji' }} />
      <Stack.Screen name='SelectGrammarLesson' component={SelectGrammarLesson} options={{ title: 'Danh sách ngữ pháp' }} />
      <Stack.Screen name='GrammarLessonDetail' component={GrammarLessonDetail} options={({ route }) => ({
        title: route.params.lesson.title
      })} />
      <Stack.Screen name='VocabularyLessonDetail' component={VocabularyLessonDetail} options={({ route }) => ({
        title: route.params.lesson.title
      })} />
      <Stack.Screen name='Test' component={Test} options={{ title: 'Ôn tập kiến thức' }} />
    </Stack.Navigator>
  )
}

export default FreeDocumentNavigation