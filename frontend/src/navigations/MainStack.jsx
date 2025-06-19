import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainDrawer from "./MainDrawer";
import InitialSurvey from "../screens/AuthScreens/InitialSurvey/InitialSurvey";
import { useAuth } from '../context/AuthContext';

const MainStack = () => {
    const Stack = createNativeStackNavigator();
    const { userToken, userInfo } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userToken ? (
                userInfo?.hasCompletedInitialSurvey ? (
                    <Stack.Screen name="MainDrawer" component={MainDrawer} />
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
