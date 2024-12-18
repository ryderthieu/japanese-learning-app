import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./src/navigations/AuthStack";
import "./global.css"
import MainDrawer from "./src/navigations/MainDrawer";
import { AuthProvider } from "./src/context/AuthContext";
export default function App() {
  const Stack = createNativeStackNavigator()
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="AuthStack" component={AuthStack} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

