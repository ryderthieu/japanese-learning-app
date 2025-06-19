import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import userService from '../../../api/userService';
import Icon from 'react-native-vector-icons/Ionicons';

const JLPTDashboard = ({ navigation }) => {
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
      console.log('JLPT Stats received:', stats);
      setJlptStats(stats);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê JLPT:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionName = (sectionKey) => {
    const sectionNames = {
      'moji-goi': '文字・語彙',
      'bunpou': '文法',
      'dokkai': '読解',
      'choukai': '聴解'
    };
    return sectionNames[sectionKey] || sectionKey;
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
          <Text className="text-2xl font-bold text-gray-800 mb-4">Tổng quan thống kê</Text>
          <View className="bg-white rounded-xl p-4 shadow-md">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">Cấp độ hiện tại</Text>
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-pink-500 mr-2">
                  {jlptStats.level || 'Chưa xác định'}
                </Text>
                <Icon name="arrow-forward" size={16} color="#666" />
                <Text className="text-xl font-bold text-green-500 ml-2">
                  {jlptStats.targetLevel || 'Chưa xác định'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-500">
                  {jlptStats.stats?.totalTestsTaken || 0}
                </Text>
                <Text className="text-sm text-gray-600">Bài thi đã làm</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-500">
                  {Math.round(jlptStats.stats?.averageScore || 0)}
                </Text>
                <Text className="text-sm text-gray-600">Điểm trung bình</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-orange-500">
                  {Math.round(jlptStats.stats?.bestScore || 0)}
                </Text>
                <Text className="text-sm text-gray-600">Điểm cao nhất</Text>
              </View>
            </View>

            {/* Section Strengths */}
            {jlptStats.stats?.strongestSection && jlptStats.stats?.weakestSection && (
              <View className="bg-gray-50 rounded-lg p-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Thế mạnh & điểm yếu:</Text>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center">
                    <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text className="text-sm text-green-600 ml-1">
                      Mạnh: {getSectionName(jlptStats.stats.strongestSection)}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Icon name="alert-circle" size={16} color="#FF9800" />
                    <Text className="text-sm text-orange-600 ml-1">
                      Yếu: {getSectionName(jlptStats.stats.weakestSection)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Recent Attempts */}
          {jlptStats.recentAttempts && jlptStats.recentAttempts.length > 0 && (
            <View className="mt-4 bg-white rounded-xl p-4 shadow-md">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Lần thi gần nhất</Text>
              {(() => {
                const latestAttempt = jlptStats.recentAttempts[0];
                if (!latestAttempt || !latestAttempt.answers) {
                  return (
                    <View className="items-center py-4">
                      <Text className="text-gray-500">Chưa có dữ liệu chi tiết</Text>
                    </View>
                  );
                }

                const correctAnswers = latestAttempt.answers.filter(a => a.isCorrect).length;
                const totalQuestions = latestAttempt.answers.length;
                const percentage = Math.round((correctAnswers / totalQuestions) * 100);

                return (
                  <View>
                    {/* Header thông tin bài thi */}
                    <View className="bg-gray-50 rounded-lg p-3 mb-4">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-medium text-gray-800">
                          Điểm: {latestAttempt.score}/{latestAttempt.maxScore}
                        </Text>
                        <Text className={`font-bold text-lg ${percentage >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                          {percentage}%
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500">
                          {new Date(latestAttempt.completedAt).toLocaleDateString('vi-VN')}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {formatTime(latestAttempt.timeSpent)}
                        </Text>
                      </View>
                    </View>

                    {/* Thống kê nhanh */}
                    <View className="flex-row justify-around mb-4">
                      <View className="items-center">
                        <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                          <Icon name="checkmark" size={20} color="#059669" />
                        </View>
                        <Text className="text-xs text-gray-600 text-center">Đúng</Text>
                        <Text className="text-lg font-bold text-green-600">
                          {correctAnswers}
                        </Text>
                      </View>
                      
                      <View className="items-center">
                        <View className="bg-red-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                          <Icon name="close" size={20} color="#DC2626" />
                        </View>
                        <Text className="text-xs text-gray-600 text-center">Sai</Text>
                        <Text className="text-lg font-bold text-red-600">
                          {totalQuestions - correctAnswers}
                        </Text>
                      </View>
                      
                      <View className="items-center">
                        <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-2">
                          <Icon name="calculator" size={20} color="#2563EB" />
                        </View>
                        <Text className="text-xs text-gray-600 text-center">Tổng</Text>
                        <Text className="text-lg font-bold text-blue-600">
                          {totalQuestions}
                        </Text>
                      </View>
                    </View>

                    {/* Mẫu đáp án gần đây (hiển thị 10 câu đầu) */}
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-3">
                        Đáp án đã chọn (xem {Math.min(10, totalQuestions)} / {totalQuestions} câu):
                      </Text>
                      <View className="flex-row flex-wrap gap-2 mb-3">
                        {latestAttempt.answers.slice(0, 10).map((answer, index) => (
                          <View
                            key={index}
                            className={`w-10 h-10 rounded-lg items-center justify-center border-2 ${
                              answer.isCorrect 
                                ? 'bg-green-100 border-green-400' 
                                : 'bg-red-100 border-red-400'
                            }`}
                          >
                            <Text 
                              className={`font-bold ${
                                answer.isCorrect ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {answer.selectedOption !== undefined 
                                ? String.fromCharCode(65 + answer.selectedOption) 
                                : '?'}
                            </Text>
                          </View>
                        ))}
                        {totalQuestions > 10 && (
                          <View className="w-10 h-10 rounded-lg items-center justify-center bg-gray-100 border-2 border-gray-300">
                            <Text className="text-gray-500 font-bold text-xs">
                              +{totalQuestions - 10}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-gray-500 text-center mb-2">
                        🟢 = Đúng • 🔴 = Sai • Nhấn "Xem chi tiết" để xem tất cả câu hỏi
                      </Text>
                    </View>

                    {/* Nút xem chi tiết */}
                    <View className="flex-row gap-3 mt-4">
                      <TouchableOpacity 
                        className="flex-1 bg-blue-500 rounded-lg py-3 px-4 flex-row items-center justify-center"
                        onPress={() => {
                          // Điều hướng đến JLPTTestReview với chỉ testId, component sẽ tự lấy dữ liệu
                          navigation.navigate('JLPTTestReview', {
                            testId: latestAttempt.testId?._id || latestAttempt.testId,
                            test: latestAttempt.testId
                          });
                        }}
                      >
                        <Icon name="eye-outline" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                          Xem chi tiết
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        className="flex-1 bg-gray-500 rounded-lg py-3 px-4 flex-row items-center justify-center"
                        onPress={() => navigation.navigate('JLPTHistory')}
                      >
                        <Icon name="time-outline" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                          Lịch sử
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })()}
            </View>
          )}
        </View>
      )}

      <LevelSelector />

      {/* Bottom Spacing */}
      <View className="h-20" />
    </ScrollView>
  );
};

export default JLPTDashboard; 