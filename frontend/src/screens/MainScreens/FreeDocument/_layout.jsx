import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SelectVocabLesson from './SelectVocabLesson'
import SelectKanjiLesson from './SelectKanjiLesson'
import SelectGrammarLesson from './SelectGrammarLesson'
import Vocab from './Vocab'
import Kanji from './Kanji'
import DocumentLevel from './DocumentLevel'
import VocabList from './VocabList'
import KanjiList from './KanjiList'
import Test from './Test'
import { Icon } from '@rneui/themed'
import { TouchableOpacity, Text } from 'react-native'

const FreeDocumentNavigation = ({navigation}) => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator>
        <Stack.Screen name='DocumentLevel' component={DocumentLevel} options={{
                    headerShown: true,
                    // headerLeft: () => (
                    //     <TouchableOpacity className='flex z-10 flex-row justify-center items-center -ml-4' onPress={() => navigation.goBack()}>
                    //       <Icon name="chevron-back-outline" type='ionicon' size={29} color={'#007AFF'} />
                    //       <Text className='text-[#007AFF] text-xl'>Back</Text>
                    //     </TouchableOpacity>
                    // ),
                    title: 'Tài liệu offline',
                }}
            />
        <Stack.Screen name='SelectVocabLesson' component={SelectVocabLesson} options={{title: 'Danh sách bài học'}}/>
        <Stack.Screen name='VocabList' component={VocabList} options={{title: 'Danh sách từ vựng'}}/>
        <Stack.Screen name='Vocab' component={Vocab} options={{title: 'Học từ vựng'}}/>
        <Stack.Screen name='SelectKanjiLesson' component={SelectKanjiLesson} options={{title: 'Danh sách bài học'}}/>
        <Stack.Screen name='KanjiList' component={KanjiList} options={{title: 'Danh sách kanji'}}/>
        <Stack.Screen name='Kanji' component={Kanji} options={{title: 'Học kanji'}}/>
        <Stack.Screen name='SelectGrammarLesson' component={SelectGrammarLesson} options={{title: 'Danh sách ngữ pháp'}}/>
        <Stack.Screen name='Test' component={Test} options={{title: 'Ôn tập'}}/>
    </Stack.Navigator>
  )
}

export default FreeDocumentNavigation