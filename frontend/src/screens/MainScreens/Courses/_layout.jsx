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
        }}
      >
        <Stack.Screen
          name="Courses"
          component={Courses}
          options={{
            title: "Khóa học",
            headerLeft: () => (
              <Icon
                name="menu-outline"
                size={24}
                color="#000"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{
                  marginRight: 20
                }}
              />
            ),
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
