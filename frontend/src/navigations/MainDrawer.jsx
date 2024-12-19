import React from "react";
import { View, Text, Image } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import MainTab from "./MainTab";
import Setting from "../screens/OtherScreens/Setting/Setting";
import Notification from "../screens/OtherScreens/Notification/Notification";
import Help from "../screens/OtherScreens/Help/Help";
import Icon from "react-native-vector-icons/Ionicons";
import NotificationNavigation from "../screens/OtherScreens/Notification/_layout";
import SettingNavigation from "../screens/OtherScreens/Setting/_layout";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <View className="items-center mb-4">
                <Image
                    source={require("../assets/logo/logo-app.png")}
                    className="w-60"
                    resizeMode="contain"
                />
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

const MainDrawer = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "#FFFFFF",
                    width: 300,
                },
                drawerActiveTintColor: "#F490AF", 
                drawerInactiveTintColor: "#333333", 
                drawerLabelStyle: {
                    fontSize: 16,
                },
                headerStyle: {
                    backgroundColor: "#F490AF", 
                },
                headerTintColor: "#FFFFFF", 
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Drawer.Screen
                name="MainTab"
                component={MainTab}
                options={{
                    headerShown: false,
                    title: "Trang chủ",
                    drawerIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Setting"
                component={SettingNavigation}
                options={{
                    title: "Cài đặt",
                    drawerIcon: ({ color, size }) => (
                        <Icon name="settings-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="NotificationNavigation"
                component={NotificationNavigation}
                options={{
                    headerShown: false,
                    title: "Thông báo",
                    drawerIcon: ({ color, size }) => (
                        <Icon name="notifications-outline" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Help"
                component={Help}
                options={{
                    title: "Trợ giúp",
                    drawerIcon: ({ color, size }) => (
                        <Icon name="help-circle-outline" color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

export default MainDrawer;
