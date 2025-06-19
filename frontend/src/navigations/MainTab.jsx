import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CoursesNavigation from '../screens/MainScreens/Courses/_layout';
import DocumentStack from '../screens/MainScreens/Documents/_layout';
import Dictionary from '../screens/MainScreens/Dictionary/Dictionary';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeNavigation from '../screens/MainScreens/Home/_layout';
import JLPTNavigation from '../screens/MainScreens/JLPT/_layout';
import ProfileStack from '../screens/MainScreens/Profile/ProfileStack';

const MainTab = () => {
  const Tab = createBottomTabNavigator();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F490AF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
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
        name="JLPTNavigation"
        component={JLPTNavigation}
        options={{
          title: 'Thi thử',
          tabBarIcon: ({ color, size }) => (
            <Icon name="school" size={size} color={color} />
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
          headerStyle: {backgroundColor: '#F490AF'},
          headerTitleStyle: {color: '#fff'},
          headerTintColor: '#fff'
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
