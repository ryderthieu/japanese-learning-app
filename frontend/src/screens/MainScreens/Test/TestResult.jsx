import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TestResult = ({ navigation, route }) => {
  const { score, totalQuestions, questions, answers } = route.params;

  const handleRetry = () => {
    navigation.navigate('Test'); 
  };

  const handleReview = () => {
    navigation.navigate('ReviewQuestions', { questions: questions, answers: answers });
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-5">Kết quả thi</Text>
      <Text className="text-lg">Điểm: {score}/{totalQuestions}</Text>
      <Text className="text-lg mb-5">Thời gian hoàn thành: 45 phút</Text>

      <TouchableOpacity 
        className="bg-blue-500 py-3 px-8 rounded-lg mt-4"
        onPress={handleReview}
      >
        <Text className="text-white text-lg">Xem lại câu hỏi</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-blue-500 py-3 px-8 rounded-lg mt-4"
        onPress={handleRetry}
      >
        <Text className="text-white text-lg">Làm lại</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestResult;
