import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import aiService from '../../../api/aiService';
import { ModalContext } from '../../../context/ModalContext';
import { LoadingSpinner, InlineLoading } from '../../../context/LoadingContext';

const ConversationChat = ({ navigation, route }) => {
  const { scenario, scenarioName, level } = route.params;
  console.log('🎯 ConversationChat received params:', { scenario, scenarioName, level });
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const scrollViewRef = useRef();
  const { openModal } = useContext(ModalContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    if (conversationStarted) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [conversationStarted]);

  useEffect(() => {
    // Set header right button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          className="bg-white/20 px-3 py-2 rounded-lg"
          onPress={endConversation}
          disabled={loading || messages.length === 0}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold ">
            Kết thúc
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [loading, messages.length]);

  const startConversation = async () => {
    try {
      console.log('🚀 Bắt đầu cuộc hội thoại với params:', { scenario, level });
      setLoading(true);
      const newSessionId = `conv_${Date.now()}`;
      setSessionId(newSessionId);
      console.log('📱 Session ID được tạo:', newSessionId);

      const response = await aiService.startConversation(scenario, level, newSessionId);
      console.log('✅ Response từ startConversation:', response);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now(),
          text: response.data.aiMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        
        console.log('💬 AI message được tạo:', aiMessage);
        setMessages([aiMessage]);
        setConversationStarted(true);
        console.log('✅ Conversation started successfully');
      } else {
        console.log('❌ Response không thành công:', response);
        openModal({
          title: 'Lỗi',
          type: 'error',
          message: response.message || 'Không thể bắt đầu hội thoại'
        });
      }
    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      openModal({
        title: 'Lỗi',
        type: 'error',
        message: 'Không thể bắt đầu hội thoại. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
      console.log('🔄 Loading state đã được tắt');
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
      console.error('Error sending message:', error);
      openModal({
        title: 'Lỗi',
        type: 'error',
        message: 'Không thể gửi tin nhắn. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const endConversation = () => {
    openModal({
      title: 'Kết thúc hội thoại',
      type: 'warning',
      message: 'Bạn có chắc chắn muốn kết thúc hội thoại này?',
      onConfirm: async () => {
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
          console.error('Error ending conversation:', error);
          openModal({
            title: 'Lỗi',
            type: 'error',
            message: 'Không thể kết thúc hội thoại. Vui lòng thử lại.'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getAIRole = (scenario) => {
    const roles = {
      'restaurant': 'Nhân viên',
      'shopping': 'Nhân viên bán hàng',
      'station': 'Nhân viên ga',
      'hotel': 'Lễ tân',
      'doctor': 'Bác sĩ',
      'school': 'Giáo viên',
      'friend': 'Bạn',
      'interview': 'Nhà tuyển dụng'
    };
    return roles[scenario] || 'AI';
  };

  const renderMessage = (message, index) => (
    <Animated.View
      key={message.id}
      className={`mb-6 ${message.isUser ? 'items-end' : 'items-start'}`}
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        }],
      }}
    >
      {/* Avatar and Name */}
      <View className={`flex-row items-end mb-2 ${message.isUser ? 'flex-row-reverse' : ''}`}>
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            message.isUser ? 'bg-pink-500 ml-2' : 'bg-blue-500 mr-2'
          }`}
        >
          <Icon
            name={message.isUser ? 'person' : 'chatbubble'}
            size={16}
            color="#fff"
          />
        </View>
        <Text className="text-xs text-gray-500 font-medium">
          {message.isUser ? 'Bạn' : getAIRole(scenario)}
        </Text>
      </View>

      {/* Message Bubble */}
      <View
        className={`max-w-[75%] p-4 rounded-2xl border ${
          message.isUser
            ? 'bg-pink-500 border-pink-400 rounded-br-lg'
            : 'bg-white border-gray-100 rounded-bl-lg'
        }`}
        style={{
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 2,
        }}
      >
        <Text
          className={`text-base leading-6 ${
            message.isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.text}
        </Text>
        
        {/* Timestamp */}
        <Text
          className={`text-xs mt-2 ${
            message.isUser ? 'text-pink-100' : 'text-gray-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gradient-to-b from-gray-50 to-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Messages Container */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6 pt-6"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
      >
        {!conversationStarted && loading ? (
          <LoadingSpinner 
            text="Đang khởi tạo cuộc hội thoại..." 
            style={{ backgroundColor: 'transparent', paddingVertical: 80 }}
          />
        ) : (
          <>
            {messages.map((message, index) => renderMessage(message, index))}

            {/* Loading Indicator */}
            {loading && (
              <View className="items-start mb-6">
                <View className="bg-white border border-gray-100 rounded-2xl rounded-bl-lg p-3">
                  <InlineLoading 
                    text="AI đang suy nghĩ..." 
                    size="small"
                    style={{ paddingVertical: 0 }}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Enhanced Input Section */}
      {conversationStarted && (
        <View className="bg-white border-t border-gray-100">
          <View className="p-4">
            <View className="flex-row items-end space-x-3">
              {/* Input Container */}
              <View className="flex-1 bg-gray-50 rounded-2xl border border-gray-200">
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Nhập tin nhắn bằng tiếng Nhật..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  className="text-base text-gray-800 px-4 py-3 min-h-12 max-h-32"
                  onSubmitEditing={sendMessage}
                  blurOnSubmit={false}
                />
              </View>
              
              {/* Send Button */}
              <TouchableOpacity
                className={`w-12 h-12 rounded-xl items-center justify-center ${
                  inputText.trim() && !loading
                    ? 'bg-pink-500'
                    : 'bg-gray-300'
                }`}
                style={{
                  elevation: inputText.trim() && !loading ? 1 : 0.5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 2,
                }}
                onPress={sendMessage}
                disabled={!inputText.trim() || loading}
                activeOpacity={0.8}
              >
                <Icon
                  name="send"
                  size={20}
                  color={inputText.trim() && !loading ? '#fff' : '#9CA3AF'}
                />
              </TouchableOpacity>
            </View>
            
            {/* Input Hint */}
            <Text className="text-xs text-gray-400 mt-2 text-center">
              💡 Sử dụng hiragana, katakana hoặc kanji để trả lời
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ConversationChat; 