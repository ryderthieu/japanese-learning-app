import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import testService from '../../../api/testService';
import userService from '../../../api/userService';
import { useFocusEffect } from '@react-navigation/native';

const JLPTTestList = ({ navigation, route }) => {
  const { level, type } = route.params;
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [level, type]);

  // Refresh danh sách khi quay lại màn hình
  useFocusEffect(
    React.useCallback(() => {
      fetchTests();
    }, [level, type])
  );

  const fetchTests = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy danh sách bài thi theo level và type
      const response = await testService.getTestsByLevel(level, { type });
      // Lấy thêm thông tin lịch sử của user để xác định trạng thái completed
      const historyResponse = await userService.getTestHistory(1, 100);
      
      const completedTestIds = (historyResponse.testAttempts || [])
        .map(attempt => attempt.testId?._id || attempt.testId) || [];
      
      
      // Cập nhật trạng thái completed cho từng test
      const testsWithStatus = (response.tests || []).map(test => ({
        ...test,
        completed: completedTestIds.includes(test._id),
      }));
      
      setTests(testsWithStatus);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đề thi:', error);
      // Fallback với dữ liệu mặc định nếu API lỗi
      const fallbackTests = [
        {
          _id: 1,
          title: `${type === 'mini' ? 'Mini Test' : 'Đề thi'} số 1`,
          description: 'Ngữ pháp và Từ vựng',
          completed: true,
          score: 80,
          totalQuestions: 15,
          totalTime: type === 'mini' ? 15 : 30,
        },
        {
          _id: 2,
          title: `${type === 'mini' ? 'Mini Test' : 'Đề thi'} số 2`,
          description: 'Đọc hiểu và Nghe hiểu',
          completed: true,
          score: 65,
          totalQuestions: 15,
          totalTime: type === 'mini' ? 15 : 30,
        },
        {
          _id: 3,
          title: `${type === 'mini' ? 'Mini Test' : 'Đề thi'} số 3`,
          description: 'Tổng hợp',
          completed: false,
          totalQuestions: 15,
          totalTime: type === 'mini' ? 15 : 30,
        },
      ];
      setTests(fallbackTests);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPress = (test) => {
    if (test.completed) {
      setSelectedTest(test);
      setShowActionModal(true);
    } else {
      // Navigate đến màn hình phù hợp dựa trên type
      const targetScreen = type === 'mini' ? 'JLPTMiniTest' : 'JLPTTest';
      navigation.navigate(targetScreen, {
        level,
        type,
        testId: test._id || test.id,
      });
    }
  };

  const ActionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showActionModal}
      onRequestClose={() => setShowActionModal(false)}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        activeOpacity={1}
        onPress={() => setShowActionModal(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="items-center mb-6">
              <View className="w-12 h-1 bg-gray-300 rounded-full mb-4" />
              <Text className="text-xl font-bold text-gray-800">
                {selectedTest?.title}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Điểm số: {selectedTest?.score}/100
              </Text>
            </View>

            <TouchableOpacity
              className="bg-pink-500 rounded-xl p-4 mb-3"
              onPress={() => {
                const targetScreen = type === 'mini' ? 'JLPTMiniTest' : 'JLPTTest';
                setShowActionModal(false);
                navigation.navigate(targetScreen, {
                  level,
                  type,
                  testId: selectedTest._id || selectedTest.id,
                  mode: 'retry',
                });
              }}
            >
              <Text className="text-white font-bold text-center text-lg">
                Làm lại bài thi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-100 rounded-xl p-4 mb-3"
              onPress={() => {
                console.log('Navigate to JLPTTestReview with testId:', selectedTest._id || selectedTest.id);
                navigation.navigate('JLPTTestReview', { 
                  testId: selectedTest._id || selectedTest.id 
                });
              }}
            >
              <Text className="text-gray-800 font-bold text-center text-lg">
                Xem lại bài thi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-xl p-4"
              onPress={() => setShowActionModal(false)}
            >
              <Text className="text-gray-500 font-bold text-center text-lg">
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F472B6" />
        <Text className="text-gray-600 mt-4">Đang tải danh sách đề thi...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-800">
            {type === 'mini' ? 'Mini Test' : 'Đề thi thật'} {level}
          </Text>
          <Text className="text-gray-600 mt-1">
            {type === 'mini'
              ? 'Bài thi ngắn để luyện tập'
              : 'Mô phỏng đề thi JLPT thật'}
          </Text>
        </View>

        {tests.map((test) => (
          <TouchableOpacity
            key={test._id || test.id}
            className="bg-white rounded-xl p-4 shadow-sm mb-4"
            onPress={() => handleTestPress(test)}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-gray-800">{test.title}</Text>
              {test.completed ? (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-600 font-medium">Đã làm</Text>
                </View>
              ) : (
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-600 font-medium">Chưa làm</Text>
                </View>
              )}
            </View>

            <Text className="text-gray-600 mb-3">{test.description}</Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Icon name="time-outline" size={16} color="#666" />
                <Text className="text-gray-600 ml-1">
                  {test.totalTime} phút
                </Text>
                <Icon name="help-circle-outline" size={16} color="#666" className="ml-4" />
                <Text className="text-gray-600 ml-1">
                  {test.totalQuestions} câu hỏi
                </Text>
              </View>
              {test.completed && (
                <Text className="text-lg font-bold text-pink-500">
                  {test.score}/100
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ActionModal />
    </View>
  );
};

export default JLPTTestList; 