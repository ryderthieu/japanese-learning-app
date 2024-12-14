import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/MainScreens/Home/Home"
import CoursesNavigation from "../screens/MainScreens/Courses/_layout"
import DocumentStack from "../screens/MainScreens/Documents/_layout"

const MainTab = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="CoursesNavigation" component={CoursesNavigation}/>
      <Tab.Screen name="DocumentStack" component={DocumentStack}/>
    </Tab.Navigator>
  )
}

export default MainTab