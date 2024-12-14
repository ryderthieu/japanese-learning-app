import { createDrawerNavigator } from "@react-navigation/drawer"
import MainTab from "./MainTab"

const MainDrawer = () => {
    const Drawer = createDrawerNavigator()
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="MainTab" component={MainTab} />
        </Drawer.Navigator>
    )
}
export default MainDrawer