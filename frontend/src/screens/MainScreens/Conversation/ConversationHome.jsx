import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LinearGradient,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ModalContext } from '../../../context/ModalContext';

const ConversationHome = ({ navigation }) => {
  const { openModal } = useContext(ModalContext);
  const [selectedLevel, setSelectedLevel] = useState('N5');

  const levels = [
    { key: 'N5', label: 'N5', subtitle: 'Cơ bản', color: '#10B981', gradient: ['#10B981', '#059669'] },
    { key: 'N4', label: 'N4', subtitle: 'Sơ cấp', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] },
    { key: 'N3', label: 'N3', subtitle: 'Trung cấp', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
    { key: 'N2', label: 'N2', subtitle: 'Khá', color: '#EF4444', gradient: ['#EF4444', '#DC2626'] },
    { key: 'N1', label: 'N1', subtitle: 'Thành thạo', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
  ];

  const scenarios = [
    {
      key: 'restaurant',
      name: 'Nhà hàng',
      description: 'Luyện hội thoại khi đi ăn ở nhà hàng Nhật',
      icon: 'restaurant-outline',
      color: '#F97316',
      gradient: ['#F97316', '#EA580C'],
      example: 'いらっしゃいませ！何名様ですか？',
      difficulty: 'Dễ'
    },
    {
      key: 'shopping',
      name: 'Mua sắm',
      description: 'Thực hành mua sắm tại cửa hàng',
      icon: 'bag-outline',
      color: '#EC4899',
      gradient: ['#EC4899', '#DB2777'],
      example: 'これはいくらですか？',
      difficulty: 'Dễ'
    },
    {
      key: 'station',
      name: 'Ga tàu',
      description: 'Hỏi đường và di chuyển bằng tàu điện',
      icon: 'train-outline',
      color: '#06B6D4',
      gradient: ['#06B6D4', '#0891B2'],
      example: '渋谷までいくらですか？',
      difficulty: 'Trung bình'
    },
    {
      key: 'hotel',
      name: 'Khách sạn',
      description: 'Check-in và các dịch vụ khách sạn',
      icon: 'bed-outline',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED'],
      example: 'チェックインをお願いします。',
      difficulty: 'Trung bình'
    },
    {
      key: 'doctor',
      name: 'Bệnh viện',
      description: 'Khám bệnh và mô tả triệu chứng',
      icon: 'medical-outline',
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
      example: '頭が痛いです。',
      difficulty: 'Khó'
    },
    {
      key: 'school',
      name: 'Trường học',
      description: 'Hội thoại với giáo viên và bạn học',
      icon: 'school-outline',
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      example: '宿題を忘れました。',
      difficulty: 'Dễ'
    },
    {
      key: 'friend',
      name: 'Bạn bè',
      description: 'Trò chuyện thân mật với bạn Nhật',
      icon: 'people-outline',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
      example: '今度、映画を見に行きませんか？',
      difficulty: 'Dễ'
    },
    {
      key: 'interview',
      name: 'Phỏng vấn',
      description: 'Phỏng vấn xin việc tại công ty Nhật',
      icon: 'briefcase-outline',
      color: '#6366F1',
      gradient: ['#6366F1', '#4F46E5'],
      example: '自己紹介をお願いします。',
      difficulty: 'Khó'
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ': return '#10B981';
      case 'Trung bình': return '#F59E0B';
      case 'Khó': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderScenarioCard = (scenario, index) => (
    <TouchableOpacity
      key={scenario.key}
      className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden border border-gray-100"
      style={{
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      }}
      onPress={() => {
        navigation.navigate('ConversationChat', {
          scenario: scenario.key,
          scenarioName: scenario.name,
          level: selectedLevel
        });
      }}
      activeOpacity={0.9}
    >
      {/* Gradient Header */}
      <View 
        className="h-2 w-full"
        style={{
          backgroundColor: scenario.color
        }}
      />
      
      <View className="p-5">
        <View className="flex-row items-start">
          {/* Icon Container */}
          <View
            className="w-14 h-14 rounded-xl items-center justify-center mr-4"
            style={{ 
              backgroundColor: `${scenario.color}10`,
              borderWidth: 1,
              borderColor: `${scenario.color}20`
            }}
          >
            <Icon name={scenario.icon} size={24} color={scenario.color} />
          </View>
          
          <View className="flex-1">
            {/* Title and Difficulty */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-gray-800">
                {scenario.name}
              </Text>
              <View 
                className="px-2 py-1 rounded-lg"
                style={{ backgroundColor: `${getDifficultyColor(scenario.difficulty)}15` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: getDifficultyColor(scenario.difficulty) }}
                >
                  {scenario.difficulty}
                </Text>
              </View>
            </View>
            
            {/* Description */}
            <Text className="text-gray-600 mb-3 text-sm leading-5">
              {scenario.description}
            </Text>
            
            {/* Example Section */}
            <View className="bg-gray-50 rounded-lg p-3 border-l-3" style={{ borderLeftColor: scenario.color }}>
              <View className="flex-row items-center mb-1">
                <Icon name="chatbubble-ellipses-outline" size={14} color="#6B7280" />
                <Text className="text-xs font-medium text-gray-500 ml-2">VÍ DỤ CÂU HỎI</Text>
              </View>
              <Text className="text-sm font-medium text-gray-800">
                {scenario.example}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center mt-4 py-3 rounded-xl"
          style={{ backgroundColor: `${scenario.color}08` }}
          onPress={() => {
            navigation.navigate('ConversationChat', {
              scenario: scenario.key,
              scenarioName: scenario.name,
              level: selectedLevel
            });
          }}
        >
          <Icon name="play-circle-outline" size={18} color={scenario.color} />
          <Text className="font-semibold ml-2 text-sm" style={{ color: scenario.color }}>
            Bắt đầu luyện tập
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-pink-50 to-white">
      <View className="bg-white shadow-lg border-b border-gray-100">

        <View className="p-6 pb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Chọn cấp độ của bạn
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            <View className="flex-row space-x-3 gap-3">
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  className={`px-5 py-3 rounded-xl border min-w-20 items-center ${
                    selectedLevel === level.key
                      ? 'border-pink-300 bg-pink-50'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedLevel(level.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-base font-bold ${
                      selectedLevel === level.key
                        ? 'text-pink-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {level.label}
                  </Text>
                  <Text
                    className={`text-xs font-medium mt-1 ${
                      selectedLevel === level.key
                        ? 'text-pink-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {level.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Scenarios List */}
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            🎭 Tình huống thực tế
          </Text>
          <Text className="text-gray-600 leading-6">
            AI sẽ chỉ nói tiếng Nhật thuần túy. Hãy cố gắng hiểu và trả lời bằng tiếng Nhật!
          </Text>
        </View>

        {scenarios.map((scenario, index) => renderScenarioCard(scenario, index))}

        {/* Enhanced Tips */}
        <View className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-blue-500 rounded-lg items-center justify-center">
              <Icon name="bulb" size={16} color="#fff" />
            </View>
            <Text className="text-lg font-bold text-blue-800 ml-3">
              💡 Mẹo luyện tập
            </Text>
          </View>
          <View className="space-y-2">
            {[
              'Đừng lo lắng về lỗi ngữ pháp, hãy tập trung vào giao tiếp',
              'Sử dụng từ vựng đơn giản nếu chưa biết từ phức tạp',
              'AI sẽ điều chỉnh độ khó phù hợp với cấp độ của bạn',
              'Hãy thử nói nhiều câu để được đánh giá tốt hơn'
            ].map((tip, index) => (
              <View key={index} className="flex-row items-start">
                <View className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3" />
                <Text className="text-blue-700 text-sm leading-5 flex-1">
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConversationHome; 