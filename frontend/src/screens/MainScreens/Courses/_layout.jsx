import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import Courses from "./Courses";
import Cart from "./Cart";
import CourseDetail from "./CourseDetail";
import PaymentScreen from "../Payment/PaymentScreen";
import PaymentProcessScreen from "../Payment/PaymentProcessScreen";
import PaymentSuccessScreen from "../Payment/PaymentSuccessScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { CartProvider } from "../../../context/CartContext";
import { TouchableOpacity } from "react-native";

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
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{
          title: 'Thanh toán khóa học'
        }} />
        <Stack.Screen 
          name="PaymentProcess" 
          component={PaymentProcessScreen} 
          options={({ route, navigation }) => ({
            title: 'Thanh toán',
            headerLeft: null, // Ẩn nút back để user không thể quay lại khi đang thanh toán
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  // Trigger refresh function trong component
                  const currentRoute = route;
                  if (currentRoute?.params?.onRefresh) {
                    currentRoute.params.onRefresh();
                  }
                }}
                style={{ padding: 8 }}
              >
                <Icon name="refresh" size={20} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="PaymentSuccess" 
          component={PaymentSuccessScreen} 
          options={{
            headerShown: false, // Ẩn header bar
            gestureEnabled: false, // Tắt gesture swipe back
          }}
        />
      </Stack.Navigator>
    </CartProvider>

  );
}
