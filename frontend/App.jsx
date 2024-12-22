import { NavigationContainer } from "@react-navigation/native";
import "./global.css"
import { AuthProvider } from "./src/context/AuthContext";
import MainStack from "./src/navigations/MainStack";
import { LoadingProvider } from "./src/context/LoadingContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ModalProvider } from "./src/context/ModalContext";

export default function App() {
  const Stack = createNativeStackNavigator()
  return (
    <LoadingProvider>
      <ModalProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="MainStack" component={MainStack} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ModalProvider>
    </LoadingProvider>
  );
}

