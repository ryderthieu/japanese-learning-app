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
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SentOTP" component={SentOTP} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
