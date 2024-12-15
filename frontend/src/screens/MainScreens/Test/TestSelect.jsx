import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TestSelect = ({ route, navigation }) => {
  const { level } = route.params;

  const handleTestSelect = (testType) => {
    navigation.navigate('Test', { level, testType });
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 p-6">
      <Text className="text-3xl font-bold text-blue-900 mb-12">Chọn đề thi cho cấp độ {level}</Text>
      {[1, 2, 3, 4].map((testNumber) => (
        <TouchableOpacity
          key={testNumber}
          onPress={() => handleTestSelect(`Đề ${testNumber}`)}
          className="bg-pink-400 py-4 px-10 rounded-lg mb-4 w-3/4 items-center"
        >
          <Text className="text-white text-xl font-semibold">Đề {testNumber}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TestSelect;
