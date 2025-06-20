import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import aiService from '../../../api/aiService';

const ConversationChat = ({ navigation, route }) => {
  const { scenario, scenarioName, level } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = async () => {
    try {
      setLoading(true);
      const newSessionId = `conv_${Date.now()}`;
      setSessionId(newSessionId);

      const response = await aiService.startConversation(scenario, level, newSessionId);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now(),
          text: response.data.aiMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        
        setMessages([aiMessage]);
        setConversationStarted(true);
      }
    } catch (error) {
      console.error('Lỗi khi bắt đầu hội thoại:', error);
      Alert.alert('Lỗi', 'Không thể bắt đầu hội thoại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        message: msg.text,
        timestamp: msg.timestamp,
      }));

      const response = await aiService.continueConversation(
        sessionId,
        userMessage.text,
        conversationHistory,
        scenario,
        level
      );

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.aiMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const endConversation = () => {
    if (messages.length < 4) {
      Alert.alert(
        'Kết thúc hội thoại?',
        'Bạn nên trò chuyện thêm một chút để có đánh giá tốt hơn. Bạn có chắc muốn kết thúc?',
        [
          { text: 'Tiếp tục', style: 'cancel' },
          { text: 'Kết thúc', onPress: handleEndConversation },
        ]
      );
    } else {
      handleEndConversation();
    }
  };

  const handleEndConversation = async () => {
    try {
      setLoading(true);
      
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        message: msg.text,
        timestamp: msg.timestamp,
      }));

      const response = await aiService.endConversation(
        sessionId,
        conversationHistory,
        scenario,
        level
      );

      if (response.success) {
        navigation.replace('ConversationResult', {
          sessionId,
          scenario,
          scenarioName,
          level,
          messages,
          evaluation: response.data.evaluation,
          stats: response.data.conversationSummary,
        });
      }
    } catch (error) {
      console.error('Lỗi khi kết thúc hội thoại:', error);
      Alert.alert('Lỗi', 'Không thể kết thúc hội thoại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[80%] p-3 rounded-2xl ${
          message.isUser
            ? 'bg-pink-500 rounded-br-md'
            : 'bg-white border border-gray-200 rounded-bl-md'
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            message.isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            message.isUser ? 'text-pink-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-pink-500 p-4 border-b border-pink-600">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">
              {scenarioName} - {level}
            </Text>
            <Text className="text-pink-100 text-sm">
              {messages.length > 0 ? `${Math.floor(messages.length / 2)} lượt trao đổi` : 'Đang bắt đầu...'}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-pink-600 px-4 py-2 rounded-full"
            onPress={endConversation}
            disabled={loading || messages.length === 0}
          >
            <Text className="text-white font-semibold text-sm">
              Kết thúc
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      >
        {!conversationStarted && loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#F472B6" />
            <Text className="text-gray-600 mt-4">Đang bắt đầu hội thoại...</Text>
          </View>
        ) : (
          <>
            {/* Welcome message */}
            <View className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-4">
              <Text className="text-pink-800 text-center font-medium">
                🎯 Hãy trò chuyện bằng tiếng Nhật với AI!{'\n'}
                AI sẽ chỉ nói tiếng Nhật để bạn luyện tập tốt nhất.
              </Text>
            </View>

            {messages.map(renderMessage)}

            {loading && (
              <View className="items-start mb-4">
                <View className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3">
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#F472B6" />
                    <Text className="text-gray-500 ml-2">AI đang suy nghĩ...</Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Input */}
      {conversationStarted && (
        <View className="bg-white border-t border-gray-200 p-4">
          <View className="flex-row items-end space-x-3">
            <View className="flex-1 max-h-24 min-h-12 bg-gray-100 rounded-2xl px-4 py-3">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Nhập tin nhắn bằng tiếng Nhật..."
                placeholderTextColor="#9CA3AF"
                multiline
                className="text-base text-gray-800 min-h-6"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              className={`w-12 h-12 rounded-full items-center justify-center ${
                inputText.trim() && !loading
                  ? 'bg-pink-500'
                  : 'bg-gray-300'
              }`}
              onPress={sendMessage}
              disabled={!inputText.trim() || loading}
            >
              <Icon
                name="send"
                size={20}
                color={inputText.trim() && !loading ? '#fff' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ConversationChat; 