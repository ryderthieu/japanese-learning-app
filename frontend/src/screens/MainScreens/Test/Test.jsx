import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import CheckBox from 'react-native-check-box';

const Test = ({ route, navigation }) => {
  const { level, testType } = route.params;
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentTab, setCurrentTab] = useState(0); 

  const questions = [
    {
      question: '問題の読み方として最もよいものを、1・2・3・4から選びなさい。',
      options: ['さわり', 'へんり', 'かたより', 'とどこおり'],
      correctAnswer: 'さわり',
    },
    {
      question: '学校の復興に尽くし、学生たちから慕われていた田中先生が老衰で亡くなったそうだ。',
      options: ['ふくこう', 'ふくきょう', 'ふっこう', 'ふっきょう'],
      correctAnswer: 'ふっこう',
    },
    {
      question: '問題の読み方として最もよいものを、1・2・3・4から選びなさい。',
      options: ['さわり', 'へんり', 'かたより', 'とどこおり'],
      correctAnswer: 'さわり',
    },
    {
      question: '学校の復興に尽くし、学生たちから慕われていた田中先生が老衰で亡くなったそうだ。',
      options: ['ふくこう', 'ふくきょう', 'ふっこう', 'ふっきょう'],
      correctAnswer: 'ふっこう',
    },
    {
      question: '問題の読み方として最もよいものを、1・2・3・4から選びなさい。',
      options: ['さわり', 'へんり', 'かたより', 'とどこおり'],
      correctAnswer: 'さわり',
    },
    {
      question: '学校の復興に尽くし、学生たちから慕われていた田中先生が老衰で亡くなったそうだ。',
      options: ['ふくこう', 'ふくきょう', 'ふっこう', 'ふっきょう'],
      correctAnswer: 'ふっこう',
    },
  ];

  const handleAnswer = (questionIndex, selectedOption) => {
    console.log(selectedOption)

    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));

    if (selectedOption === questions[questionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleFinishTest = () => {
    Alert.alert('Kết quả', `Điểm số của bạn là: ${score} / ${questions.length}`);
    navigation.navigate('TestResult', { score, total: questions.length, questions: questions, answers: selectedAnswers });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderItem = ({ item, index }) => (
    <View className="mb-4 p-4 bg-white rounded-lg border border-gray-300">
      <Text className="text-lg font-bold mb-2">{item.question}</Text>
      {item.options.map((option, optionIndex) => (
        <View key={optionIndex} className="flex-row items-center mb-2">
          <CheckBox
            isChecked={selectedAnswers[index] === option}
            onClick={() => handleAnswer(index, option)}
          />
          <Text className="text-base text-black">{option}</Text>
        </View>
      ))}
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

  const filteredQuestions = currentTab === 0 ? questions.slice(0, Math.ceil(questions.length / 2)) : questions.slice(Math.ceil(questions.length / 2));

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg text-gray-800">Thời gian còn lại: {timeRemaining}s</Text>
        <TouchableOpacity onPress={handleFinishTest} className="bg-red-500 py-2 px-4 rounded-md">
          <Text className="text-white">Nộp Bài</Text>
        </TouchableOpacity>
      </View>

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

export default Test;
