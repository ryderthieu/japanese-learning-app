import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LevelSelect = ({ navigation }) => {
  const handleLevelSelect = (level) => {
    navigation.navigate('TestSelect', { level });
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <Text className="text-3xl font-bold text-blue-900 mb-12">Chọn cấp độ JLPT</Text>
      {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
        <TouchableOpacity
          key={level}
          onPress={() => handleLevelSelect(level)}
          className="bg-pink-400 py-4 px-10 rounded-lg mb-4 w-3/4 items-center"
        >
          <Text className="text-white text-xl font-semibold">{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LevelSelect;
