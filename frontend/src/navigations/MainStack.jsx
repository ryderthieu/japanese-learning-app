import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainTab from "./MainTab";
import InitialSurvey from "../screens/AuthScreens/InitialSurvey/InitialSurvey";
import { useAuth } from '../context/AuthContext';

const MainStack = () => {
    const Stack = createNativeStackNavigator();
    const { userToken, userInfo } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userToken ? (
                userInfo?.hasCompletedInitialSurvey ? (
                    <Stack.Screen name="MainTab" component={MainTab} />
                ) : (
                    <Stack.Screen name="InitialSurvey" component={InitialSurvey} />
                )
            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
}

export default MainStack;
