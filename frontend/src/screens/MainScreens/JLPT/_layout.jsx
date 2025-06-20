import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JLPTDashboard from './JLPTDashboard';
import JLPTLevelSelect from './JLPTLevelSelect';
import JLPTTest from './JLPTTest';
import JLPTHistory from './JLPTHistory';
import JLPTMiniTest from './JLPTMiniTest';
import JLPTTestList from './JLPTTestList';
import JLPTTestResult from './JLPTTestResult';
import JLPTTestReview from './JLPTTestReview';

const Stack = createNativeStackNavigator();

const JLPTNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F472B6',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: '#ffffff',
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="JLPTDashboard"
        component={JLPTDashboard}
        options={{
          title: 'Thi thử JLPT',
          headerStyle: {
            backgroundColor: '#F472B6',
            elevation: 8,
            shadowColor: '#F472B6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
        }}
      />
      <Stack.Screen
        name="JLPTLevelSelect"
        component={JLPTLevelSelect}
        options={{
          title: 'Chọn cấp độ JLPT',
        }}
      />
      <Stack.Screen
        name="JLPTMiniTest"
        component={JLPTMiniTest}
        options={{
          title: 'Mini Test JLPT',
        }}
      />
      <Stack.Screen
        name="JLPTTest"
        component={JLPTTest}
        options={{
          title: 'Đề thi JLPT',
        }}
      />
      <Stack.Screen
        name="JLPTHistory"
        component={JLPTHistory}
        options={{
          title: 'Lịch sử thi',
        }}
      />
      <Stack.Screen
        name="JLPTTestList"
        component={JLPTTestList}
        options={{
          title: 'Danh sách đề thi',
        }}
      />
      <Stack.Screen
        name="JLPTTestResult"
        component={JLPTTestResult}
        options={{
          title: 'Kết quả thi',
        }}
      />
      <Stack.Screen
        name="JLPTTestReview"
        component={JLPTTestReview}
        options={{
          title: 'Xem lại bài thi',
        }}
      />
    </Stack.Navigator>
  );
};

export default JLPTNavigation; 