import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/MainScreens/Home/Home';
import CoursesNavigation from '../screens/MainScreens/Courses/_layout';
import DocumentStack from '../screens/MainScreens/Documents/_layout';
import Dictionary from '../screens/MainScreens/Dictionary/Dictionary';
import Icon from 'react-native-vector-icons/Ionicons';
import TestStack from '../screens/MainScreens/Test/_layout';
import HomeNavigation from '../screens/MainScreens/Home/_layout';
import { useNavigation } from '@react-navigation/native';

const MainTab = () => {
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F490AF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="HomeNavigation"
        component={HomeNavigation}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="CoursesNavigation"
        component={CoursesNavigation}
        options={{
          title: 'Khóa học',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="DocumentStack"
        component={DocumentStack}
        options={{
          title: 'Học tập',
          tabBarIcon: ({ color, size }) => (
            <Icon name="document-text" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          title: 'Từ điển',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
          headerLeft: () => (
            <Icon
              name="menu-outline"
              size={24}
              color="#fff"
              onPress={() => navigation.openDrawer()}
              style={{
                marginRight: 20,
                marginLeft: 20
              }}
            />
          ),
          headerStyle: {backgroundColor: '#F490AF'},
          headerTitleStyle: {color: '#fff'},
          headerTintColor: '#fff'
        }}
      />

      <Tab.Screen
        name="TestStack"
        component={TestStack}
        options={{
          title: 'Thi thử',
          tabBarIcon: ({ color, size }) => (
            <Icon name="create" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
