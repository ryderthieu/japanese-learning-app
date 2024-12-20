import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainDrawer from "./MainDrawer";
import { AuthContext } from '../context/AuthContext';

const MainStack = () => {
    const Stack = createNativeStackNavigator();
    const { token } = useContext(AuthContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token ? (
                <Stack.Screen name="MainDrawer" component={MainDrawer} />

            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
}

export default MainStack;
