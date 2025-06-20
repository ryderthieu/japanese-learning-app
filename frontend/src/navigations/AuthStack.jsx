import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/AuthScreens/Login/Login";
import Register from "../screens/AuthScreens/Register/Register";
import ForgotPassword from "../screens/AuthScreens/ForgotPassword/ForgotPassword";
import SentOTP from "../screens/AuthScreens/ForgotPassword/SentOTP";
import ChangePassword from "../screens/AuthScreens/ForgotPassword/ChangePassword";

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { 
          backgroundColor: '#F472B6',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerTitleStyle: { 
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
        title: 'Quên mật khẩu',
        headerShown: true
      }} />
      <Stack.Screen name="SentOTP" component={SentOTP} options={{
        title: "Quên mật khẩu",
        headerShown: true
      }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{
        title: "Quên mật khẩu",
        headerShown: true
      }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
