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
import { LoadingSpinner } from '../../../context/LoadingContext';

const JLPTTestResult = ({ navigation, route }) => {
  const { openModal } = useContext(ModalContext);
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
    
    // Debug: Log tất cả dữ liệu nhận được
    console.log('JLPTTestResult route.params:', route.params);
    console.log('testId:', testId);
    console.log('test:', test);
  }, [resultData]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      // Nếu không có resultData, có thể fetch từ API dựa trên testId
      if (testId) {
        const response = await testService.getTestResult(testId);
        setResult(response);
      }
    } catch (error) {
      console.error('Lỗi khi lấy kết quả:', error);
      openModal({
        title: 'Lỗi',
        type: 'error',
        message: 'Không thể tải kết quả bài thi'
      });
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
    console.log('🔍 Checking data for review:', {
      hasResult: !!result,
      hasQuestions: result?.questions?.length,
      hasUserAnswers: result?.userAnswers?.length,
      testId: testId,
      test: !!test
    });

    // Kiểm tra các trường hợp dữ liệu có sẵn
    if (result?.questions && result.questions.length > 0) {
      // Trường hợp có đầy đủ dữ liệu trong result
      console.log('✅ Using result data for review');
      navigation.navigate('JLPTTestReview', {
        questions: result.questions,
        answers: result.userAnswers || [],
        result: result,
        testId: testId,
        test: test
      });
    } else if (testId) {
      // Trường hợp chỉ có testId, để JLPTTestReview tự fetch
      console.log('📡 Using testId for review');
      navigation.navigate('JLPTTestReview', {
        testId: testId,
        test: test,
        result: result
      });
    } else {
      // Không có đủ dữ liệu
      openModal({
        title: 'Thông báo',
        type: 'warning',
        message: 'Không có thông tin bài thi để xem lại. Vui lòng thử lại sau.'
      });
    }
  };

  const handleRetakeTest = () => {
    openModal({
      title: 'Làm lại bài thi',
      type: 'confirm',
      message: 'Bạn có muốn làm lại bài thi này?',
      onConfirm: () => navigation.navigate('JLPTTest', { 
        testId: testId,
        level: test?.level,
        mode: 'retry'
      })
    });
  };

  const handleShare = () => {
    openModal({
      title: 'Chia sẻ',
      type: 'info',
      message: 'Tính năng chia sẻ sẽ được cập nhật sau'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải kết quả..." />;
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
  const scorePercentage = Math.round((result.score / result.maxScore) * 100);
  const isPassed = result.passed || false;

  return (
    <View className="flex-1 bg-gray-50">

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
                <Text className="text-3xl font-bold text-black">
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
        <View className="mb-8 flex-row justify-between gap-4">
          {/* Primary Action - Review Test */}
          <TouchableOpacity
            onPress={handleReviewTest}
            className="bg-blue-500 rounded-xl p-4 mb-3 shadow-lg flex-1"
            style={{ elevation: 3 }}
          >
            <View className="flex-row items-center justify-center">
              <Icon name="eye-outline" size={24} color="white" />
              <Text className="text-white font-bold text-base ml-3">
                Xem lại
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Secondary Actions Grid */}
            <TouchableOpacity
              onPress={handleRetakeTest}
              className="bg-pink-500 rounded-xl p-4 mb-3 shadow-lg flex-1"
              style={{ elevation: 2 }}
            >
              <View className="items-center flex-row justify-center gap-2">
                <Icon name="refresh-outline" size={24} color="white" />
                <Text className="text-white font-semibold text-base mt-1 text-center">
                  Làm lại
                </Text>
              </View>
            </TouchableOpacity>
            
        </View>
      </ScrollView>
    </View>
  );
};

export default JLPTTestResult; 