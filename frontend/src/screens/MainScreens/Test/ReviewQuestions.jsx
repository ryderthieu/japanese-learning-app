import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import CheckBox from 'react-native-check-box';

const ReviewQuestions = ({ route, navigation }) => {
  const { questions, answers } = route.params;

  const renderItem = ({ item, index }) => (
    <View className="mb-4 p-4 bg-white rounded-lg border border-gray-300">
      <Text className="text-lg font-bold mb-2">{item.question}</Text>
      {item.options.map((option, optionIndex) => {
        const isSelected = answers[`non_${index}`] === option || answers[`listening_${index}`] === option;
        const isCorrect = item.correctAnswer === option;

        let optionStyle = 'text-black';

        if (isCorrect) {
          optionStyle = 'font-bold text-green-500';
        } else if (isSelected) {
          optionStyle = 'font-bold text-red-500';
        }

        return (
          <View key={optionIndex} className="flex-row items-center mb-2">
            <CheckBox 
              isChecked={isSelected} 
              disabled 
            />
            <Text className={`text-base ${optionStyle} ml-2`}>{option}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <FlatList
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ReviewQuestions;
