import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainTab from "./MainTab";
import InitialSurvey from "../screens/AuthScreens/InitialSurvey/InitialSurvey";
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../context/LoadingContext';

// Component loading đẹp khi đang kiểm tra auth
const AuthLoadingScreen = () => (
    <LoadingSpinner 
        text="Đang kiểm tra đăng nhập..." 
        style={{ backgroundColor: '#ffffff' }}
    />
);

const MainStack = () => {
    const Stack = createNativeStackNavigator();
    const { userToken, userInfo, isCheckingAuth } = useAuth();

    // Hiển thị loading khi đang kiểm tra auth HOẶC khi có token nhưng chưa có userInfo
    if (isCheckingAuth || (userToken && !userInfo)) {
        return <AuthLoadingScreen />;
    }

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
