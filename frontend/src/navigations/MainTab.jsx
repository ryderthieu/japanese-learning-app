import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/Home"

const MainTab = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}/>

    </Tab.Navigator>
  )
}

export default MainTab