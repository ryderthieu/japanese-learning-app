import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/Home"
import Courses from "../screens/Courses"

const MainTab = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Courses" component={Courses}/>
    </Tab.Navigator>
  )
}

export default MainTab