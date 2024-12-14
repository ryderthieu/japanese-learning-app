import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyCourses from "./MyCourses";
import Courses from "./Courses";
import Cart from "./Cart";
import CourseDetail from "./CourseDetail";


export default function CoursesNavigation() {
    const Stack = createNativeStackNavigator();

  return (
      <Stack.Navigator>
        <Stack.Screen name="Courses" component={Courses} />
        <Stack.Screen name="MyCourses" component={MyCourses} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="CourseDetail" component={CourseDetail} />
      </Stack.Navigator>
  );
}
