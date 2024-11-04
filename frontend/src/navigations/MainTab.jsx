import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/Home"

const MainTab = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Coures" component={Home}/>
      <Tab.Screen name="Home1" component={Home}/>
      <Tab.Screen name="Home2" component={Home}/>
      <Tab.Screen name="Settings" component={Home}/>
    </Tab.Navigator>
  )
}

export default MainTab