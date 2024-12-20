import { NavigationContainer } from "@react-navigation/native";
import "./global.css"
import { AuthProvider } from "./src/context/AuthContext";
import MainStack from "./src/navigations/MainStack";
import { LoadingProvider } from "./src/context/LoadingContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() { 
  const Stack = createNativeStackNavigator()
  return (
    <LoadingProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="MainStack" component={MainStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </LoadingProvider>
  );
}

