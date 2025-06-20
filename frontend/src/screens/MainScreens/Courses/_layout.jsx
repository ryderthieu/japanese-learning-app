import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import Courses from "./Courses";
import Cart from "./Cart";
import CourseDetail from "./CourseDetail";
import Icon from "react-native-vector-icons/Ionicons";
import { CartProvider } from "../../../context/CartContext";

export default function CoursesNavigation() {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <CartProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
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
        <Stack.Screen
          name="Courses"
          component={Courses}
          options={{
            title: "Khóa học",
          }}
        />
        <Stack.Screen name="Cart" component={Cart} options={{
          title: 'Giỏ hàng'
        }}/>
        <Stack.Screen name="CourseDetail" component={CourseDetail} options={({ route }) => ({
          title: route.params?.item.title
        })} />
      </Stack.Navigator>
    </CartProvider>

  );
}
