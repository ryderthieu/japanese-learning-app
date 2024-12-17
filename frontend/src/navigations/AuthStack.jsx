import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/AuthScreens/Login/Login";
import Register from "../screens/AuthScreens/Register/Register";
import ForgotPassword from "../screens/AuthScreens/ForgotPassword/ForgotPassword";
import SentOTP from "../screens/AuthScreens/ForgotPassword/SentOTP";
import ChangePassword from "../screens/AuthScreens/ForgotPassword/ChangePassword";
import CheckYourLeverl from "../screens/MainScreens/CheckYourLevel/CheckYourLeverl";
import Survey from "../screens/MainScreens/CheckYourLevel/Survey";
import FreeDocument from "../screens/MainScreens/FreeDocument/SelectVocabLesson";
import FreeDocumentAll1 from "../screens/MainScreens/FreeDocument/FreeDocumentAll1";
import Vocab from "../screens/MainScreens/FreeDocument/Vocab";
import Kanji from "../screens/MainScreens/FreeDocument/Kanji";

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
      <Stack.Screen name="Survey" component={Survey} />

    </Stack.Navigator>
  );
};

export default AuthStack;
