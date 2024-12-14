import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./src/navigations/AuthStack";
import MainTab from "./src/navigations/MainTab";
import "./global.css"
import { AuthProvider } from "./Context/AuthContext";
import MainDrawer from "./src/navigations/MainDrawer";
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

