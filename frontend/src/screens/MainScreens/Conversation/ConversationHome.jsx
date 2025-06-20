import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ConversationHome = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState('N5');

  const levels = [
    { key: 'N5', label: 'N5 - Cơ bản', color: '#10B981' },
    { key: 'N4', label: 'N4 - Sơ cấp', color: '#3B82F6' },
    { key: 'N3', label: 'N3 - Trung cấp', color: '#F59E0B' },
    { key: 'N2', label: 'N2 - Khá', color: '#EF4444' },
    { key: 'N1', label: 'N1 - Thành thạo', color: '#8B5CF6' },
  ];

  const scenarios = [
    {
      key: 'restaurant',
      name: 'Nhà hàng',
      description: 'Luyện hội thoại khi đi ăn ở nhà hàng Nhật',
      icon: 'restaurant-outline',
      color: '#F97316',
      example: 'いらっしゃいませ！何名様ですか？'
    },
    {
      key: 'shopping',
      name: 'Mua sắm',
      description: 'Thực hành mua sắm tại cửa hàng',
      icon: 'bag-outline',
      color: '#EC4899',
      example: 'これはいくらですか？'
    },
    {
      key: 'station',
      name: 'Ga tàu',
      description: 'Hỏi đường và di chuyển bằng tàu điện',
      icon: 'train-outline',
      color: '#06B6D4',
      example: '渋谷までいくらですか？'
    },
    {
      key: 'hotel',
      name: 'Khách sạn',
      description: 'Check-in và các dịch vụ khách sạn',
      icon: 'bed-outline',
      color: '#8B5CF6',
      example: 'チェックインをお願いします。'
    },
    {
      key: 'doctor',
      name: 'Bệnh viện',
      description: 'Khám bệnh và mô tả triệu chứng',
      icon: 'medical-outline',
      color: '#EF4444',
      example: '頭が痛いです。'
    },
    {
      key: 'school',
      name: 'Trường học',
      description: 'Hội thoại với giáo viên và bạn học',
      icon: 'school-outline',
      color: '#10B981',
      example: '宿題を忘れました。'
    },
    {
      key: 'friend',
      name: 'Bạn bè',
      description: 'Trò chuyện thân mật với bạn Nhật',
      icon: 'people-outline',
      color: '#F59E0B',
      example: '今度、映画を見に行きませんか？'
    },
    {
      key: 'interview',
      name: 'Phỏng vấn',
      description: 'Phỏng vấn xin việc tại công ty Nhật',
      icon: 'briefcase-outline',
      color: '#6366F1',
      example: '自己紹介をお願いします。'
    },
  ];

  const handleStartConversation = (scenario) => {
    Alert.alert(
      'Bắt đầu hội thoại',
      `Bạn muốn luyện hội thoại "${scenario.name}" ở cấp độ ${selectedLevel}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bắt đầu',
          onPress: () => {
            navigation.navigate('ConversationChat', {
              scenario: scenario.key,
              scenarioName: scenario.name,
              level: selectedLevel,
            });
          },
        },
      ]
    );
  };

  const renderScenarioCard = (scenario) => (
    <TouchableOpacity
      key={scenario.key}
      className="bg-white rounded-xl p-4 shadow-md mb-4"
      onPress={() => handleStartConversation(scenario)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: `${scenario.color}20` }}
        >
          <Icon name={scenario.icon} size={24} color={scenario.color} />
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {scenario.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            {scenario.description}
          </Text>
          <View className="bg-gray-50 p-2 rounded-lg">
            <Text className="text-xs text-gray-500 mb-1">Ví dụ câu hỏi:</Text>
            <Text className="text-sm font-medium text-gray-700">
              {scenario.example}
            </Text>
          </View>
        </View>
        
        <View className="ml-2">
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header với Level Selector */}
      <View className="bg-white shadow-sm border-b border-gray-100">
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Chọn cấp độ của bạn
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            <View className="flex-row space-x-3">
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  className={`px-4 py-2 rounded-full border-2 ${
                    selectedLevel === level.key
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedLevel(level.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedLevel === level.key
                        ? 'text-teal-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Scenarios List */}
      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Chọn tình huống hội thoại
          </Text>
          <Text className="text-sm text-gray-600">
            AI sẽ chỉ nói tiếng Nhật thuần túy. Hãy cố gắng hiểu và trả lời bằng tiếng Nhật!
          </Text>
        </View>

        {scenarios.map(renderScenarioCard)}

        {/* Tips */}
        <View className="bg-teal-50 border border-teal-200 rounded-xl p-4 mt-4">
          <View className="flex-row items-center mb-2">
            <Icon name="bulb-outline" size={20} color="#0D9488" />
            <Text className="text-base font-bold text-teal-800 ml-2">
              Mẹo luyện tập
            </Text>
          </View>
          <Text className="text-sm text-teal-700 leading-5">
            • Đừng lo lắng về lỗi ngữ pháp, hãy tập trung vào giao tiếp{'\n'}
            • Sử dụng từ vựng đơn giản nếu chưa biết từ phức tạp{'\n'}
            • AI sẽ điều chỉnh độ khó phù hợp với cấp độ của bạn{'\n'}
            • Hãy thử nói nhiều câu để được đánh giá tốt hơn
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConversationHome; 