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
        headerTitleStyle: {
          color: '#EC4899',
        },
        headerTintColor: '#EC4899',
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