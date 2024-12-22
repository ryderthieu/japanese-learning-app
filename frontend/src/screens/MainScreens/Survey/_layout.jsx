import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Survey from '../Survey/Survey'


const SurveyNavigation = ({ navigation, route }) => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator>
            <Stack.Screen name='Survey' component={Survey} options={{headerShown: false}}  />
        </Stack.Navigator>
    )
}

export default SurveyNavigation