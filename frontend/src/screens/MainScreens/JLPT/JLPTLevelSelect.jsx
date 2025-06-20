import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { testService } from '../../../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { ModalContext } from '../../../context/ModalContext';

const JLPTLevelSelect = ({ navigation, route }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedLevel = route.params?.level;
  const { openModal } = useContext(ModalContext);

  const JLPTLevels = [
    {
      level: 'N5',
      name: 'N5 - Cơ bản',
      description: 'Hiểu được tiếng Nhật cơ bản',
      color: '#4CAF50',
      icon: 'leaf',
      requirements: '800 giờ học',
      kanji: '100 ký tự',
      vocabulary: '800 từ',
    },
    {
      level: 'N4',
      name: 'N4 - Sơ cấp',
      description: 'Hiểu được tiếng Nhật sơ cấp',
      color: '#2196F3',
      icon: 'water',
      requirements: '1600 giờ học',
      kanji: '300 ký tự',
      vocabulary: '1500 từ',
    },
    {
      level: 'N3',
      name: 'N3 - Trung cấp',
      description: 'Hiểu được tiếng Nhật trung cấp',
      color: '#FF9800',
      icon: 'flame',
      requirements: '3000 giờ học',
      kanji: '650 ký tự',
      vocabulary: '3000 từ',
    },
    {
      level: 'N2',
      name: 'N2 - Trung cao',
      description: 'Hiểu được tiếng Nhật trung cao',
      color: '#E91E63',
      icon: 'diamond',
      requirements: '6000 giờ học',
      kanji: '1000 ký tự',
      vocabulary: '6000 từ',
    },
    {
      level: 'N1',
      name: 'N1 - Cao cấp',
      description: 'Hiểu được tiếng Nhật cao cấp',
      color: '#9C27B0',
      icon: 'star',
      requirements: '9000 giờ học',
      kanji: '2000 ký tự',
      vocabulary: '10000 từ',
    },
  ];

  useEffect(() => {
    if (selectedLevel) {
      fetchTestsByLevel(selectedLevel);
    }
  }, [selectedLevel]);

  const fetchTestsByLevel = async (level) => {
    try {
      setLoading(true);
      const response = await testService.getTestsByLevel(level);
      setTests(response.tests || []);
    } catch (error) {
      console.error('Error loading tests:', error);
      openModal({
        title: 'Lỗi',
        type: 'error',
        message: 'Không thể tải danh sách bài thi'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLevelSelect = (level) => {
    navigation.navigate('JLPTLevelSelect', { level });
  };

  const handleTestSelect = (test) => {
    navigation.navigate('JLPTTest', { test });
  };

  const handlePracticeSelect = (level, module) => {
    navigation.navigate('JLPTVocabulary', { level, module });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F490AF" />
        <Text className="text-lg text-gray-600 mt-4">Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-b from-pink-400 to-pink-600 p-6">
        <Text className="text-3xl font-bold text-white mb-2">
          {selectedLevel ? `JLPT ${selectedLevel}` : 'Chọn cấp độ JLPT'}
        </Text>
        <Text className="text-white text-lg opacity-90">
          {selectedLevel 
            ? 'Chọn bài thi hoặc luyện tập'
            : 'Chọn cấp độ bạn muốn học'
          }
        </Text>
      </View>

      {!selectedLevel ? (
        // Level Selection
        <View className="p-4">
          {JLPTLevels.map((item) => (
            <TouchableOpacity
              key={item.level}
              className="bg-white rounded-xl p-6 shadow-md mb-4"
              onPress={() => handleLevelSelect(item.level)}
            >
              <View className="flex-row items-center">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon name={item.icon} size={32} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800 mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-gray-600 mb-2">{item.description}</Text>
                  <View className="flex-row flex-wrap">
                    <Text className="text-xs bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
                      {item.requirements}
                    </Text>
                    <Text className="text-xs bg-gray-100 px-2 py-1 rounded mr-2 mb-1">
                      {item.kanji}
                    </Text>
                    <Text className="text-xs bg-gray-100 px-2 py-1 rounded mb-1">
                      {item.vocabulary}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-forward" size={24} color="#F490AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        // Test and Practice Selection
        <View className="p-4">
          {/* Practice Modules */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Luyện tập</Text>
            <View className="grid grid-cols-2 gap-4">
              {[
                { title: 'Từ vựng', icon: 'book-outline', color: '#4CAF50', module: 'vocabulary' },
                { title: 'Ngữ pháp', icon: 'construct-outline', color: '#2196F3', module: 'grammar' },
                { title: 'Đọc hiểu', icon: 'document-text-outline', color: '#FF9800', module: 'reading' },
                { title: 'Nghe hiểu', icon: 'headset-outline', color: '#E91E63', module: 'listening' },
              ].map((module) => (
                <TouchableOpacity
                  key={module.title}
                  className="bg-white rounded-xl p-4 shadow-md"
                  onPress={() => handlePracticeSelect(selectedLevel, module.module)}
                >
                  <View className="items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: module.color }}
                    >
                      <Icon name={module.icon} size={24} color="white" />
                    </View>
                    <Text className="font-semibold text-gray-800 text-center">
                      {module.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Tests */}
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-4">Bài thi thử</Text>
            {tests.length > 0 ? (
              tests.map((test, index) => (
                <TouchableOpacity
                  key={test._id || index}
                  className="bg-white rounded-xl p-4 shadow-md mb-3"
                  onPress={() => handleTestSelect(test)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800 mb-1">
                        {test.title || `Bài thi ${index + 1}`}
                      </Text>
                      <Text className="text-gray-600 mb-2">
                        {test.description || 'Bài thi thử JLPT'}
                      </Text>
                      <View className="flex-row items-center">
                        <Icon name="time-outline" size={16} color="#F490AF" />
                        <Text className="text-sm text-gray-600 ml-1">
                          {test.duration || 120} phút
                        </Text>
                        <Icon name="help-circle-outline" size={16} color="#F490AF" className="ml-4" />
                        <Text className="text-sm text-gray-600 ml-1">
                          {test.questionCount || 50} câu hỏi
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      {test.isCompleted && (
                        <View className="bg-green-100 px-2 py-1 rounded mb-2">
                          <Text className="text-xs text-green-700">Đã hoàn thành</Text>
                        </View>
                      )}
                      <Icon name="play-circle-outline" size={32} color="#F490AF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="bg-white rounded-xl p-8 shadow-md items-center">
                <Icon name="document-outline" size={48} color="#ccc" />
                <Text className="text-gray-500 text-lg mt-4 text-center">
                  Chưa có bài thi nào cho cấp độ {selectedLevel}
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Hãy thử luyện tập các kỹ năng trước
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Bottom Spacing */}
      <View className="h-20" />
    </ScrollView>
  );
};

export default JLPTLevelSelect; 