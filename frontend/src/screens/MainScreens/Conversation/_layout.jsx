import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationHome from './ConversationHome';
import ConversationChat from './ConversationChat';
import ConversationResult from './ConversationResult';

const ConversationStack = createNativeStackNavigator();

const ConversationNavigation = () => {
  return (
    <ConversationStack.Navigator
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
          fontSize: 18,
        },
        headerTitleAlign: 'left',
        headerBackTitleVisible: false,
      }}
    >
      <ConversationStack.Screen
        name="ConversationHome"
        component={ConversationHome}
        options={{
          title: 'Luyện hội thoại AI',
          headerTitleAlign: 'center',
        }}
      />
      <ConversationStack.Screen
        name="ConversationChat"
        component={ConversationChat}
        options={({ route }) => ({
          title: `${route.params?.scenarioName || 'Tình huống'} - ${route.params?.level || 'N/A'}`,
        })}
      />
      <ConversationStack.Screen
        name="ConversationResult"
        component={ConversationResult}
        options={{
          title: 'Kết quả hội thoại',
          headerTitleAlign: 'center',
        }}
      />
    </ConversationStack.Navigator>
  );
};

export default ConversationNavigation; 