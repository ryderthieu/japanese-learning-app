import React from 'react';
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
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}
    >
      <ConversationStack.Screen
        name="ConversationHome"
        component={ConversationHome}
        options={{
          title: 'Luyện hội thoại AI',
        }}
      />
      <ConversationStack.Screen
        name="ConversationChat"
        component={ConversationChat}
        options={{
          title: 'Hội thoại với AI',
        }}
      />
      <ConversationStack.Screen
        name="ConversationResult"
        component={ConversationResult}
        options={{
          title: 'Kết quả hội thoại',
        }}
      />
    </ConversationStack.Navigator>
  );
};

export default ConversationNavigation; 