import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import CheckBox from 'react-native-check-box';
import testData from './test.json';
import { Audio } from 'expo-av';

const Test = ({ route, navigation }) => {
  const { level, testType } = route.params;
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); 

  const listeningSection = testData.sections.find((section) => section.name === '聴解 (Nghe hiểu)');
  const nonListeningSections = testData.sections.filter((section) => section.name !== '聴解 (Nghe hiểu)');

  const listeningQuestions = listeningSection.subsections.flatMap((subsection) =>
    subsection.questions.map((q) => ({
      subsectionTitle:subsection.title,
      question: q.content,
      options: q.format.answers.map((answer) => answer.content),
      correctAnswer: q.format.answers.find((answer) => answer.isCorrect).content,
      audio: subsection.audio,
    }))
  );

  const nonListeningQuestions = nonListeningSections.flatMap((section) =>
    section.subsections.flatMap((subsection) =>
      subsection.questions.map((q) => ({
        sectionTitle: section.name,
        subsectionTitle: subsection.title,
        question: q.content,
        options: q.format.answers.map((answer) => answer.content),
        correctAnswer: q.format.answers.find((answer) => answer.isCorrect).content,
        text: subsection.text || null,
      }))
    )
  );

  const currentQuestions = currentTab === 0 ? nonListeningQuestions : listeningQuestions;

  const handleAnswer = (selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentTab === 0 ? `non_${currentQuestionIndex}` : `listening_${currentQuestionIndex}`]: selectedOption,
    }));

    if (selectedOption === currentQuestions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleFinishTest = () => {
    if (sound) {
      sound.unloadAsync();
    }
    navigation.navigate('TestResult', {
      score,
      total: nonListeningQuestions.length + listeningQuestions.length,
      questions: nonListeningQuestions.concat(listeningQuestions),
      answers: selectedAnswers,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
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

  useEffect(() => {
    if (currentTab === 1 && currentQuestionIndex < listeningQuestions.length) {
      const playAudio = async () => {
        const audioIndex = currentQuestionIndex;
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: listeningQuestions[audioIndex].audio });
        setSound(newSound);
        await newSound.playAsync();
      };
      playAudio();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentTab, currentQuestionIndex]);

  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg text-gray-800">Thời gian còn lại: {timeRemaining}s</Text>
        <TouchableOpacity onPress={handleFinishTest} className="bg-red-500 py-2 px-4 rounded-md">
          <Text className="text-white">Nộp Bài</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-evenly mb-4">
        <TouchableOpacity
          onPress={() => {
            setCurrentTab(0);
            setCurrentQuestionIndex(0);
          }}
          className={`py-2 px-6 rounded-lg mx-2 ${currentTab === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <Text className={`${currentTab === 0 ? 'text-white' : 'text-gray-700'}`}>Từ vựng - Đọc</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCurrentTab(1);
            setCurrentQuestionIndex(0);
          }}
          className={`py-2 px-6 rounded-lg mx-2 ${currentTab === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <Text className={`${currentTab === 1 ? 'text-white' : 'text-gray-700'}`}>Nghe</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="mb-4 p-6 bg-white rounded-lg border border-gray-300">
          <Text className="text-lg font-bold mb-4">{currentQuestion.sectionTitle || ''}</Text>
          <Text className="text-lg font-semibold mb-2">{currentQuestion.subsectionTitle || ''}</Text>
          {currentQuestion.text && (
            <View className="mb-4">
              <Text className="text-base text-gray-800">{currentQuestion.text}</Text>
            </View>
          )}
          <Text className="text-lg mb-4">{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              className="mb-2 p-4 bg-gray-200 rounded-lg flex-row items-center"
              onPress={() => handleAnswer(option)}
            >
              <CheckBox
                isChecked={
                  selectedAnswers[
                    currentTab === 0 ? `non_${currentQuestionIndex}` : `listening_${currentQuestionIndex}`
                  ] === option
                }
                onClick={() => handleAnswer(option)}
              />
              <Text className="text-base text-black ml-2">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          onPress={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`py-2 px-4 rounded-md ${currentQuestionIndex === 0 ? 'bg-gray-300' : 'bg-blue-500'}`}
        >
          <Text className={`${currentQuestionIndex === 0 ? 'text-gray-700' : 'text-white'}`}>Câu Trước</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNextQuestion}
          disabled={currentQuestionIndex === currentQuestions.length - 1}
          className={`py-2 px-4 rounded-md ${currentQuestionIndex === currentQuestions.length - 1 ? 'bg-gray-300' : 'bg-blue-500'}`}
        >
          <Text className={`${currentQuestionIndex === currentQuestions.length - 1 ? 'text-gray-700' : 'text-white'}`}>Câu Tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Test;
