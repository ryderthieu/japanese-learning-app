import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TestResult = ({ navigation, route }) => {
  const { score, total, questions, answers } = route.params;

  const handleRetry = () => {
    navigation.navigate('LevelSelect'); 
  };

  const handleReview = () => {
    navigation.navigate('ReviewQuestions', { questions, answers });
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-gray-100">
      <View className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <Text className="text-2xl font-bold mb-5 text-center text-blue-600">Kết quả bài thi</Text>
        <Text className="text-lg font-semibold text-center mb-3">Điểm số của bạn:</Text>
        <Text className="text-3xl font-bold text-green-500 text-center">{score}/{total}</Text>
        <Text className="text-sm text-gray-600 text-center mb-5">
          Tổng số câu hỏi: {total}
        </Text>
        <View className="mt-5 space-y-3 gap-3">
          <TouchableOpacity 
            className="bg-blue-500 py-3 px-8 rounded-lg"
            onPress={handleReview}
          >
            <Text className="text-white text-lg text-center">Xem lại câu hỏi</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-secondary py-3 px-8 rounded-lg"
            onPress={handleRetry}
          >
            <Text className="text-white text-lg text-center">Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TestResult;
