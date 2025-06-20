import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import AccountInfoScreen from './AccountInfoScreen';
import StudySettingsScreen from './StudySettingsScreen';
import SupportScreen from './SupportScreen';
import ChangePasswordScreen from './ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F472B6',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerTitleStyle: {
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Hồ sơ' }}
      />
      <Stack.Screen 
        name="AccountInfo" 
        component={AccountInfoScreen}
        options={{ title: 'Thông tin tài khoản' }}
      />
      <Stack.Screen 
        name="StudySettings" 
        component={StudySettingsScreen}
        options={{ title: 'Cài đặt học tập' }}
      />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen}
        options={{ title: 'Hỗ trợ' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Đổi mật khẩu' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack; 