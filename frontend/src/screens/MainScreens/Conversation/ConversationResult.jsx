import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ConversationResult = ({ navigation, route }) => {
  const {
    sessionId,
    scenario,
    scenarioName,
    level,
    messages,
    evaluation,
    stats,
  } = route.params;

  const userMessages = messages.filter(msg => msg.isUser);
  const conversationDuration = messages.length > 0 ? 
    Math.floor((new Date(messages[messages.length - 1].timestamp) - new Date(messages[0].timestamp)) / 1000 / 60) : 0;

  const handleShare = async () => {
    try {
      const shareContent = `🗣️ Kết quả luyện hội thoại tiếng Nhật\n\n` +
        `📚 Tình huống: ${scenarioName} (${level})\n` +
        `💬 Tin nhắn: ${userMessages.length} câu\n` +
        `⏱️ Thời gian: ${conversationDuration} phút\n` +
        `🎯 Tỷ lệ tham gia: ${stats?.userParticipation || 'N/A'}\n\n` +
        `Tiếp tục luyện tập để cải thiện kỹ năng tiếng Nhật! 🇯🇵`;

      await Share.share({
        message: shareContent,
        title: 'Kết quả luyện hội thoại tiếng Nhật',
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
    }
  };

  const handleTryAgain = () => {
    navigation.navigate('ConversationChat', {
      scenario,
      scenarioName,
      level,
    });
  };

  const handleBackToHome = () => {
    navigation.navigate('ConversationHome');
  };

  return (
    <View className="flex-1 bg-gray-50">
      
      <ScrollView className="flex-1 p-4">
        {/* Stats Summary */}
        <View className="bg-white rounded-xl p-4 shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            📊 Thống kê hội thoại
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <View className="flex-row items-center">
                <Icon name="chatbubbles-outline" size={20} color="#F472B6" />
                <Text className="text-gray-700 ml-2">Tổng tin nhắn</Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {messages.length} câu
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <View className="flex-row items-center">
                <Icon name="person-outline" size={20} color="#F472B6" />
                <Text className="text-gray-700 ml-2">Câu của bạn</Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {userMessages.length} câu
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <View className="flex-row items-center">
                <Icon name="time-outline" size={20} color="#F472B6" />
                <Text className="text-gray-700 ml-2">Thời gian</Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {conversationDuration} phút
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Icon name="trending-up-outline" size={20} color="#F472B6" />
                <Text className="text-gray-700 ml-2">Tỷ lệ tham gia</Text>
              </View>
              <Text className="font-semibold text-gray-800">
                {stats?.userParticipation || `${((userMessages.length / messages.length) * 100).toFixed(1)}%`}
              </Text>
            </View>
          </View>
        </View>

        {/* AI Evaluation */}
        {evaluation && (
          <View className="bg-white rounded-xl p-4 shadow-md mb-4">
            <View className="flex-row items-center mb-3">
              <Icon name="school-outline" size={20} color="#F472B6" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                🤖 Đánh giá từ AI
              </Text>
            </View>
            <View className="bg-gray-50 rounded-lg p-4">
              <Text className="text-gray-700 leading-6">
                {evaluation}
              </Text>
            </View>
          </View>
        )}

        {/* Conversation History */}
        <View className="bg-white rounded-xl p-4 shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            💬 Lịch sử hội thoại
          </Text>
          
          <ScrollView
            className="max-h-60 bg-gray-50 rounded-lg p-3"
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <View key={message.id} className="mb-3">
                <Text className="text-xs text-gray-500 mb-1">
                  {message.isUser ? '👤 Bạn' : '🤖 AI'} • {new Date(message.timestamp).toLocaleTimeString('vi-VN')}
                </Text>
                <Text className="text-gray-700 leading-5">
                  {message.text}
                </Text>
                {index < messages.length - 1 && (
                  <View className="border-b border-gray-200 mt-2" />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-8 gap-3">
          <TouchableOpacity
            className="bg-pink-500 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleTryAgain}
            activeOpacity={0.8}
          >
            <Icon name="refresh-outline" size={20} color="#fff" />
            <Text className="text-white font-semibold ml-2 text-base">
              Thử lại tình huống này
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border border-pink-500 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleBackToHome}
            activeOpacity={0.8}
          >
            <Icon name="home-outline" size={20} color="#F472B6" />
            <Text className="text-pink-600 font-semibold ml-2 text-base">
              Chọn tình huống khác
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Icon name="bulb-outline" size={20} color="#2563EB" />
            <Text className="text-base font-bold text-blue-800 ml-2">
              Lời khuyên để cải thiện
            </Text>
          </View>
          <Text className="text-sm text-blue-700 leading-5">
            • Thực hành hàng ngày 10-15 phút để cải thiện khả năng giao tiếp{'\n'}
            • Thử các tình huống khác nhau để mở rộng từ vựng{'\n'}
            • Đọc to các câu AI nói để luyện phát âm{'\n'}
            • Ghi chú những từ mới học được trong cuộc hội thoại
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConversationResult; 