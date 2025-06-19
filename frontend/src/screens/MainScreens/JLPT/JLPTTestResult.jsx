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
  const { result: resultData, test, questions, answers } = route.params || {};

  useEffect(() => {
    if (resultData) {
      setResult(resultData);
      setLoading(false);
    } else {
      fetchResult();
    }
  }, [resultData]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      // Fetch result from API if needed
      // const response = await testService.getTestResult(testId);
      // setResult(response.result);
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

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'Xuất sắc!';
    if (percentage >= 60) return 'Khá tốt!';
    if (percentage >= 40) return 'Cần cải thiện';
    return 'Cần học thêm';
  };

  const getSectionScore = (section) => {
    if (!result?.sectionScores) return { score: 0, total: 0 };
    return result.sectionScores[section] || { score: 0, total: 0 };
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReviewTest = () => {
    setShowReview(true);
  };

  const handleRetakeTest = () => {
    Alert.alert(
      'Làm lại bài thi',
      'Bạn có muốn làm lại bài thi này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Làm lại', onPress: () => navigation.navigate('JLPTTest', { test }) }
      ]
    );
  };

  const handleShareResult = () => {
    // Implement share functionality
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
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-b from-pink-400 to-pink-600 p-6">
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
                backgroundColor: getScoreColor(result.score, result.totalScore),
                opacity: 0.1
              }}
            >
              <View
                className="w-24 h-24 rounded-full items-center justify-center"
                style={{
                  backgroundColor: getScoreColor(result.score, result.totalScore)
                }}
              >
                <Text className="text-3xl font-bold text-white">
                  {Math.round((result.score / result.totalScore) * 100)}
                </Text>
              </View>
            </View>
            
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              {result.score} / {result.totalScore}
            </Text>
            <Text
              className="text-lg font-semibold"
              style={{ color: getScoreColor(result.score, result.totalScore) }}
            >
              {getScoreMessage(result.score, result.totalScore)}
            </Text>
          </View>
          
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-sm text-gray-500">Thời gian</Text>
              <Text className="text-lg font-semibold text-gray-800">
                {formatTime(result.timeSpent || 0)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">Đúng</Text>
              <Text className="text-lg font-semibold text-green-600">
                {result.correctAnswers || 0}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-sm text-gray-500">Sai</Text>
              <Text className="text-lg font-semibold text-red-600">
                {result.incorrectAnswers || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Section Scores */}
        <View className="bg-white rounded-xl p-6 shadow-md mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Điểm từng phần
          </Text>
          
          {[
            { key: 'moji_goi', name: '文字・語彙', icon: 'book-outline', color: '#4CAF50' },
            { key: 'bunpou', name: '文法', icon: 'construct-outline', color: '#2196F3' },
            { key: 'dokkai', name: '読解', icon: 'document-text-outline', color: '#FF9800' },
            { key: 'choukai', name: '聴解', icon: 'headset-outline', color: '#E91E63' },
          ].map((section) => {
            const sectionResult = getSectionScore(section.key);
            const percentage = sectionResult.total > 0 
              ? Math.round((sectionResult.score / sectionResult.total) * 100)
              : 0;
            
            return (
              <View key={section.key} className="mb-4 last:mb-0">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: section.color }}
                    >
                      <Icon name={section.icon} size={20} color="white" />
                    </View>
                    <View>
                      <Text className="font-semibold text-gray-800">
                        {section.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {sectionResult.score} / {sectionResult.total} câu
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(sectionResult.score, sectionResult.total) }}
                  >
                    {percentage}%
                  </Text>
                </View>
                
                <View className="bg-gray-200 rounded-full h-2">
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getScoreColor(sectionResult.score, sectionResult.total)
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Performance Analysis */}
        <View className="bg-white rounded-xl p-6 shadow-md mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Phân tích hiệu suất
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Tốc độ trả lời</Text>
              <Text className="font-semibold text-gray-800">
                {result.timeSpent && result.totalScore 
                  ? Math.round(result.timeSpent / result.totalScore / 60 * 10) / 10
                  : 0
                } phút/câu
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Tỷ lệ đúng</Text>
              <Text className="font-semibold text-gray-800">
                {result.totalScore > 0 
                  ? Math.round((result.score / result.totalScore) * 100)
                  : 0
                }%
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Thời gian hoàn thành</Text>
              <Text className="font-semibold text-gray-800">
                {formatTime(result.timeSpent || 0)}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Ngày thi</Text>
              <Text className="font-semibold text-gray-800">
                {new Date(result.completedAt || Date.now()).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View className="bg-white rounded-xl p-6 shadow-md mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Khuyến nghị
          </Text>
          
          <View className="space-y-3">
            {result.score < result.totalScore * 0.6 && (
              <View className="flex-row items-start">
                <Icon name="alert-circle" size={20} color="#FF9800" className="mt-1 mr-3" />
                <Text className="flex-1 text-gray-700">
                  Bạn cần ôn tập thêm các kiến thức cơ bản trước khi thi lại.
                </Text>
              </View>
            )}
            
            {result.score >= result.totalScore * 0.6 && result.score < result.totalScore * 0.8 && (
              <View className="flex-row items-start">
                <Icon name="checkmark-circle" size={20} color="#4CAF50" className="mt-1 mr-3" />
                <Text className="flex-1 text-gray-700">
                  Kết quả khá tốt! Hãy luyện tập thêm để đạt điểm cao hơn.
                </Text>
              </View>
            )}
            
            {result.score >= result.totalScore * 0.8 && (
              <View className="flex-row items-start">
                <Icon name="star" size={20} color="#FFD700" className="mt-1 mr-3" />
                <Text className="flex-1 text-gray-700">
                  Xuất sắc! Bạn đã sẵn sàng cho kỳ thi thực tế.
                </Text>
              </View>
            )}
            
            <View className="flex-row items-start">
              <Icon name="bulb-outline" size={20} color="#F490AF" className="mt-1 mr-3" />
              <Text className="flex-1 text-gray-700">
                Tiếp tục luyện tập đều đặn để duy trì và cải thiện kỹ năng.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            onPress={handleReviewTest}
            className="flex-1 bg-pink-500 py-4 rounded-xl"
          >
            <View className="flex-row items-center justify-center">
              <Icon name="eye-outline" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold text-lg">
                Xem lại
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleRetakeTest}
            className="flex-1 bg-gray-500 py-4 rounded-xl"
          >
            <View className="flex-row items-center justify-center">
              <Icon name="refresh-outline" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold text-lg">
                Làm lại
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Review Modal */}
      {showReview && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 mx-4 w-80">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Xem lại bài thi
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Bạn có muốn xem lại từng câu hỏi và đáp án đúng?
            </Text>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowReview(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setShowReview(false);
                  navigation.navigate('JLPTTestReview', {
                    test,
                    questions,
                    answers,
                    result
                  });
                }}
                className="flex-1 bg-pink-500 py-3 rounded-lg"
              >
                <Text className="text-center font-semibold text-white">
                  Xem lại
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default JLPTTestResult; 