import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { testService } from '../../../api';
import Icon from 'react-native-vector-icons/Ionicons';

const JLPTTestResult = ({ navigation, route }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const { result: resultData, test, questions, answers, testId, timeSpent } = route.params || {};

  useEffect(() => {
    if (resultData) {
      console.log('Received result data:', resultData);
      setResult(resultData);
      setLoading(false);
    } else {
      fetchResult();
    }
  }, [resultData]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      // Nếu không có resultData, có thể fetch từ API dựa trên testId
      if (testId) {
        // const response = await testService.getTestResult(testId);
        // setResult(response);
      }
    } catch (error) {
      console.error('Lỗi khi lấy kết quả:', error);
      Alert.alert('Lỗi', 'Không thể tải kết quả bài thi');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScoreMessage = (passed, percentage) => {
    if (passed) return 'Chúc mừng! Bạn đã đạt!';
    if (percentage >= 60) return 'Khá tốt! Cần cải thiện một chút';
    if (percentage >= 40) return 'Cần cải thiện nhiều hơn';
    return 'Cần học thêm nhiều';
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

  const handleReviewTest = () => {
    if (result?.answers && questions) {
      // Convert answers từ backend response để có thể hiển thị trong review
      const reviewAnswers = result.answers.map(answer => {
        const question = questions.find(q => q._id === answer.questionId);
        const correctOptionIndex = question?.options?.findIndex(opt => opt.isCorrect) ?? -1;
        
        return {
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          isCorrect: answer.selectedOption === correctOptionIndex,
          timeSpent: answer.timeSpent || 0
        };
      });

      navigation.navigate('JLPTTestReview', {
        test,
        questions,
        answers: reviewAnswers,
        result
      });
    } else {
      Alert.alert('Thông báo', 'Không có dữ liệu để xem lại bài thi');
    }
  };

  const handleRetakeTest = () => {
    Alert.alert(
      'Làm lại bài thi',
      'Bạn có muốn làm lại bài thi này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Làm lại', 
          onPress: () => navigation.navigate('JLPTTest', { 
            testId: testId,
            level: test?.level,
            mode: 'retry'
          }) 
        }
      ]
    );
  };

  const handleShareResult = () => {
    Alert.alert('Chia sẻ', 'Tính năng chia sẻ sẽ được cập nhật sau');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F490AF" />
        <Text className="text-lg text-gray-600 mt-4">Đang tải kết quả...</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Icon name="alert-circle-outline" size={64} color="#ccc" />
        <Text className="text-lg text-gray-600 mt-4">Không tìm thấy kết quả</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('JLPTDashboard')}
          className="mt-4 bg-pink-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tính toán dữ liệu hiển thị
  const scorePercentage = result.scorePercentage || Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const incorrectAnswers = result.totalQuestions - result.correctAnswers;
  const isPassed = result.passed || false;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className={`p-6 ${isPassed ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-red-400 to-red-600'}`}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('JLPTDashboard')}
            className="p-2"
          >
            <Icon name="home" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Kết quả bài thi
          </Text>
          <TouchableOpacity
            onPress={handleShareResult}
            className="p-2"
          >
            <Icon name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-white text-lg opacity-90 text-center">
          {test?.title || 'Bài thi JLPT'}
        </Text>
        
        {/* Status Badge */}
        <View className="items-center mt-4">
          <View className={`px-4 py-2 rounded-full ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}>
            <Text className="text-white font-bold">
              {isPassed ? '🎉 ĐẠT' : '😔 KHÔNG ĐẠT'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Overall Score */}
        <View className="bg-white rounded-xl p-6 shadow-md mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Điểm tổng quan
          </Text>
          
          <View className="items-center mb-4">
            <View
              className="w-32 h-32 rounded-full items-center justify-center mb-4"
              style={{
                backgroundColor: getScoreColor(result.score, result.maxScore),
                opacity: 0.1
              }}
            >
              <View
                className="w-24 h-24 rounded-full items-center justify-center"
                style={{
                  backgroundColor: getScoreColor(result.score, result.maxScore)
                }}
              >
                <Text className="text-3xl font-bold text-white">
                  {scorePercentage}%
                </Text>
              </View>
            </View>
            
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              {result.score} / {result.maxScore}
            </Text>
            <Text
              className="text-lg font-semibold text-center"
              style={{ color: getScoreColor(result.score, result.maxScore) }}
            >
              {getScoreMessage(isPassed, scorePercentage)}
            </Text>
          </View>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-sm text-gray-500">Thời gian</Text>
              <Text className="text-lg font-semibold text-gray-800">
                {formatTime(result.timeSpent)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">Đúng</Text>
              <Text className="text-lg font-semibold text-green-600">
                {result.correctAnswers}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">Sai</Text>
              <Text className="text-lg font-semibold text-red-600">
                {incorrectAnswers}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">Tổng số</Text>
              <Text className="text-lg font-semibold text-gray-800">
                {result.totalQuestions}
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Analysis */}
        <View className="bg-white rounded-xl p-6 shadow-md mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Phân tích hiệu suất
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Tỷ lệ đúng</Text>
              <Text className="font-semibold text-gray-800">
                {scorePercentage}%
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Điểm cần thiết để đạt</Text>
              <Text className="font-semibold text-gray-800">
                {test?.passingScore || 'N/A'}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Thời gian hoàn thành</Text>
              <Text className="font-semibold text-gray-800">
                {formatTime(result.timeSpent)}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600">Ngày thi</Text>
              <Text className="font-semibold text-gray-800">
                {new Date(result.completedAt || Date.now()).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            
            {result.timeSpent && result.totalQuestions && (
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-600">Thời gian trung bình/câu</Text>
                <Text className="font-semibold text-gray-800">
                  {Math.round(result.timeSpent / result.totalQuestions)} giây
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-8">
          {/* Primary Action - Review Test */}
          {result.answers && (
            <TouchableOpacity
              onPress={handleReviewTest}
              className="bg-blue-500 rounded-xl p-4 mb-3 shadow-lg"
              style={{ elevation: 3 }}
            >
              <View className="flex-row items-center justify-center">
                <Icon name="eye-outline" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-3">
                  Xem lại bài thi
                </Text>
              </View>
            </TouchableOpacity>
          )}
          
          {/* Secondary Actions Grid */}
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              onPress={handleRetakeTest}
              className="bg-pink-500 rounded-xl p-4 flex-1 mr-2 shadow-md"
              style={{ elevation: 2 }}
            >
              <View className="items-center">
                <Icon name="refresh-outline" size={22} color="white" />
                <Text className="text-white font-semibold text-sm mt-1 text-center">
                  Làm lại
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('JLPTHistory')}
              className="bg-orange-500 rounded-xl p-4 flex-1 ml-2 shadow-md"
              style={{ elevation: 2 }}
            >
              <View className="items-center">
                <Icon name="time-outline" size={22} color="white" />
                <Text className="text-white font-semibold text-sm mt-1 text-center">
                  Lịch sử
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Navigation Actions */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate('JLPTTestList', { 
                level: test?.level, 
                type: test?.category 
              })}
              className="bg-green-500 rounded-xl p-4 flex-1 mr-2 shadow-md"
              style={{ elevation: 2 }}
            >
              <View className="items-center">
                <Icon name="list-outline" size={22} color="white" />
                <Text className="text-white font-semibold text-sm mt-1 text-center">
                  Đề khác
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('JLPTDashboard')}
              className="bg-gray-500 rounded-xl p-4 flex-1 ml-2 shadow-md"
              style={{ elevation: 2 }}
            >
              <View className="items-center">
                <Icon name="home-outline" size={22} color="white" />
                <Text className="text-white font-semibold text-sm mt-1 text-center">
                  Trang chủ
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default JLPTTestResult; 