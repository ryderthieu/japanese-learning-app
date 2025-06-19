import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import { userService } from '../../../api';
import Icon from 'react-native-vector-icons/Ionicons';

const JLPTDashboard = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [jlptStats, setJlptStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [showLevelModal, setShowLevelModal] = useState(false);

  useEffect(() => {
    fetchJLPTStats();
  }, []);

  const fetchJLPTStats = async () => {
    try {
      setLoading(true);
      const stats = await userService.getJLPTStats();
      setJlptStats(stats);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê JLPT:', error);
    } finally {
      setLoading(false);
    }
  };

  const JLPTLevels = [
    { level: 'N5', name: 'N5 - Cơ bản', color: '#4CAF50', icon: 'leaf' },
    { level: 'N4', name: 'N4 - Sơ cấp', color: '#2196F3', icon: 'water' },
    { level: 'N3', name: 'N3 - Trung cấp', color: '#FF9800', icon: 'flame' },
    { level: 'N2', name: 'N2 - Trung cao', color: '#E91E63', icon: 'diamond' },
    { level: 'N1', name: 'N1 - Cao cấp', color: '#9C27B0', icon: 'star' },
  ];

  const TestTypes = [
    {
      title: 'Mini Test',
      description: 'Bài thi ngắn để luyện tập',
      icon: 'create-outline',
      color: '#F490AF',
      type: 'mini',
    },
    {
      title: 'Đề thi thật',
      description: 'Mô phỏng đề thi JLPT',
      icon: 'document-text-outline',
      color: '#4CAF50',
      type: 'full',
    },
  ];

  const QuickActions = [
    {
      title: 'Lịch sử thi',
      description: 'Xem kết quả các bài thi',
      icon: 'time-outline',
      color: '#FF9800',
      onPress: () => navigation.navigate('JLPTHistory'),
    },
  ];

  const handleStartTest = (type) => {
    if (!selectedLevel) return;
    navigation.navigate('JLPTTestList', { level: selectedLevel, type });
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setShowLevelModal(false);
  };

  const LevelSelector = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLevelModal}
      onRequestClose={() => setShowLevelModal(false)}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={() => setShowLevelModal(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Chọn cấp độ JLPT</Text>
              <TouchableOpacity onPress={() => setShowLevelModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {JLPTLevels.map((item) => (
                <TouchableOpacity
                  key={item.level}
                  className="mb-4 w-[31%]"
                  onPress={() => handleSelectLevel(item.level)}
                >
                  <View
                    className={`p-3 rounded-xl items-center ${
                      selectedLevel === item.level ? 'bg-pink-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      size={28}
                      color={selectedLevel === item.level ? '#F490AF' : item.color}
                    />
                    <Text
                      className={`font-bold mt-1 ${
                        selectedLevel === item.level ? 'text-pink-500' : 'text-gray-700'
                      }`}
                    >
                      {item.level}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Level Selection and Test Types */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-800">Thi thử JLPT</Text>
          <TouchableOpacity
            className={`flex-row items-center px-4 py-2 rounded-full ${
              selectedLevel ? 'bg-pink-100' : 'bg-gray-100'
            }`}
            onPress={() => setShowLevelModal(true)}
          >
            <Text
              className={`font-bold mr-2 ${
                selectedLevel ? 'text-pink-500' : 'text-gray-600'
              }`}
            >
              {selectedLevel || 'Chọn cấp độ'}
            </Text>
            <Icon
              name="chevron-down"
              size={20}
              color={selectedLevel ? '#F490AF' : '#666'}
            />
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold text-gray-800 mb-4">Chọn loại bài thi</Text>
        <View className="grid grid-cols-2 gap-4">
          {TestTypes.map((type) => (
            <TouchableOpacity
              key={type.title}
              className={`bg-white rounded-xl p-4 shadow-md ${
                !selectedLevel ? 'opacity-50' : ''
              }`}
              onPress={() => handleStartTest(type.type)}
              disabled={!selectedLevel}
            >
              <View className="items-center">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: type.color }}
                >
                  <Icon name={type.icon} size={32} color="white" />
                </View>
                <Text className="font-bold text-gray-800 text-center mb-1">
                  {type.title}
                </Text>
                <Text className="text-xs text-gray-600 text-center">
                  {type.description}
                </Text>
                {!selectedLevel && (
                  <Text className="text-xs text-red-500 text-center mt-2">
                    Vui lòng chọn cấp độ JLPT
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Thao tác nhanh</Text>
        <View className="grid grid-cols-1 gap-4">
          {QuickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              className="bg-white rounded-xl p-4 shadow-md flex-row items-center"
              onPress={action.onPress}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: action.color }}
              >
                <Icon name={action.icon} size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">{action.title}</Text>
                <Text className="text-xs text-gray-600">{action.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Summary */}
      {jlptStats && (
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Tổng quan</Text>
          <View className="bg-white rounded-xl p-4 shadow-md">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">Tiến độ tổng thể</Text>
              <Text className="text-2xl font-bold text-pink-500">
                {jlptStats.overallProgress || 0}%
              </Text>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-500">
                  {jlptStats.completedTests || 0}
                </Text>
                <Text className="text-sm text-gray-600">Bài thi đã làm</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-500">
                  {jlptStats.studyDays || 0}
                </Text>
                <Text className="text-sm text-gray-600">Ngày học</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <LevelSelector />

      {/* Bottom Spacing */}
      <View className="h-20" />
    </ScrollView>
  );
};

export default JLPTDashboard; 