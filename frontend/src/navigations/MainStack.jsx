import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainDrawer from "./MainDrawer";
import { useAuth } from '../context/AuthContext';

const MainStack = () => {
    const Stack = createNativeStackNavigator();
    const { userToken } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {userToken ? (
                <Stack.Screen name="MainDrawer" component={MainDrawer} />
            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
}

export default MainStack;
