import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import CheckBox from 'react-native-check-box';

const ReviewQuestions = ({ route, navigation }) => {
  const { questions, answers } = route.params;

  const [currentTab, setCurrentTab] = useState(0);

  const renderItem = ({ item, index }) => (
    <View className="mb-4 p-4 bg-white rounded-lg border border-gray-300">
      <Text className="text-lg font-bold mb-2">{item.question}</Text>
      {item.options.map((option, optionIndex) => {
        const isSelected = answers[index] === option;
        const isCorrect = item.correctAnswer === option;

        let optionClass = 'text-black';

        if (isCorrect) {
          optionClass = 'font-bold text-green-500';
        } else if (isSelected) {
          optionClass = 'font-bold text-red-500';
        }

        return (
          <View key={optionIndex} className="flex-row items-center mb-2">
            <CheckBox 
              isChecked={isSelected} 
              disabled 
              onClick = {() => console.log('Checkbox clicked')}
            />
            <Text className={`text-base ${optionClass}`}>  {option}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderTabs = () => (
    <View className="flex-row justify-center mt-5">
      <TouchableOpacity
        onPress={() => setCurrentTab(0)}
        className={`py-3 px-8 rounded-lg mx-2 ${currentTab === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <Text className={`${currentTab === 0 ? 'text-white' : 'text-gray-700'}`}>Phần 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCurrentTab(1)}
        className={`py-3 px-8 rounded-lg mx-2 ${currentTab === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <Text className={`${currentTab === 1 ? 'text-white' : 'text-gray-700'}`}>Phần 2</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredQuestions =
    currentTab === 0
      ? questions.slice(0, Math.ceil(questions.length / 2))
      : questions.slice(Math.ceil(questions.length / 2));

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <FlatList
        data={filteredQuestions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      {renderTabs()}
    </View>
  );
};

export default ReviewQuestions;
