import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/AuthScreens/Login/Login";
import Register from "../screens/AuthScreens/Register/Register";
import ForgotPassword from "../screens/AuthScreens/ForgotPassword/ForgotPassword";
import SentOTP from "../screens/AuthScreens/ForgotPassword/SentOTP";
import ChangePassword from "../screens/AuthScreens/ForgotPassword/ChangePassword";
import Survey from "../screens/MainScreens/Survey/Survey";

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#F490AF' },
        headerTitleStyle: { color: '#fff' },
        headerTintColor: '#fff'
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
      <Stack.Screen name="Survey" component={Survey} />

    </Stack.Navigator>
  );
};

export default AuthStack;
