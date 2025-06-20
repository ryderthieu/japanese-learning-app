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
          backgroundColor: '#0D9488',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <ConversationStack.Screen
        name="ConversationHome"
        component={ConversationHome}
        options={{
          title: 'Luyện hội thoại',
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