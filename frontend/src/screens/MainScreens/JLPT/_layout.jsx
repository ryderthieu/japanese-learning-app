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
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="JLPTDashboard"
        component={JLPTDashboard}
        options={{
          title: 'Thi thử JLPT',
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