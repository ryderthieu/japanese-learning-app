import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/MainScreens/Home/Home';
import CoursesNavigation from '../screens/MainScreens/Courses/_layout';
import DocumentStack from '../screens/MainScreens/Documents/_layout';
import Dictionary from '../screens/MainScreens/Dictionary/Dictionary';
import Icon from 'react-native-vector-icons/Ionicons';  
import TestStack from '../screens/MainScreens/Test/_layout';

const MainTab = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F490AF',  
        tabBarInactiveTintColor: 'gray',  
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
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
