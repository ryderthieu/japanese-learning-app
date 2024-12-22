import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './Home'
import FreeDocumentNavigation from '../FreeDocument/_layout'
import SurveyNavigation from '../Survey/_layout'
import Icon from 'react-native-vector-icons/Ionicons'
import { useEffect } from 'react'
import SavedVocabulary from './SavedVocabulary'
import SavedGrammar from './SavedGrammar'

const HomeNavigation = ({ navigation, route }) => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} options={{
                headerLeft: () => (
                    <Icon
                        name='menu'
                        size={24}
                        onPress={() => navigation.openDrawer()}
                        className='mr-[20px]'
                    />
                ),
                headerRight: () => (
                    <View className="flex flex-row gap-2 justify-center items-center">
                        <Text className="text-xl font-semibold text-[#2B308B] ">こんにちは！</Text>
                        <Image className="w-[40px] h-[40px] rounded-full" source={require('../../../assets/images/home/avatar.jpg')}></Image>
                    </View>
                ),
                title: ''
            }} />
            <Stack.Screen name='FreeDocumentNavigation' component={FreeDocumentNavigation} options={{headerShown: false}}  />
            <Stack.Screen name='SurveyNavigation' component={SurveyNavigation} options={{headerShown: false}}  />
            <Stack.Screen name='SavedVocabulary' component={SavedVocabulary} options={{title: 'Từ vựng đã lưu'}}/>
            <Stack.Screen name='SavedGrammar' component={SavedGrammar} options={{title: 'Ngữ pháp đã lưu'}}/>

        </Stack.Navigator>
    )
}

export default HomeNavigation