import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import MyCourses from "./MyCourses";
import Courses from "./Courses";
import Cart from "./Cart";
import CourseDetail from "./CourseDetail";
import Icon from "react-native-vector-icons/Ionicons";

export default function CoursesNavigation() {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();

  return (
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
                marginRight: 10
               }}
            />
          ),
        }}
      />
      <Stack.Screen name="MyCourses" component={MyCourses} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="CourseDetail" component={CourseDetail} />
    </Stack.Navigator>
  );
}
