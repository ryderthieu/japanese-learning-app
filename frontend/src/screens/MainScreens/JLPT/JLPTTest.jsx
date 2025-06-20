import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { testService, questionService } from '../../../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { ModalContext } from '../../../context/ModalContext';

const JLPTTest = ({ navigation, route }) => {
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { testId, level, type, mode } = route.params || {};
  const timerRef = useRef(null);
  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    if (testId) {
      initializeTest();
    }
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && test) {
      handleAutoSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, test]);

  const initializeTest = async () => {
    try {
      setLoading(true);
      
      // Get test details
      const testResponse = await testService.getTestById(testId);
      setTest(testResponse);
      setTimeLeft(testResponse.totalTime * 60); // Convert to seconds
      
      // Get questions for this test
      const questionsResponse = await questionService.getQuestionsByTest(testId);
      setQuestions(questionsResponse.questions || questionsResponse || []);
      
    } catch (error) {
      console.error('Lỗi khi khởi tạo bài thi:', error);
      openModal({
        title: 'Lỗi',
        type: 'error',
        message: 'Không thể tải bài thi'
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
    setShowQuestionList(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    openModal({
      title: 'Hết thời gian',
      type: 'warning',
      message: 'Thời gian làm bài đã hết. Bài thi sẽ được nộp tự động.',
      onConfirm: () => submitTest()
    });
  };

  const submitTest = async () => {
    try {
      setSubmitting(true);
      
      console.log('Submitting test with testId:', testId);
      console.log('Test data:', test);
      console.log('Raw answers:', answers);
      
      // Chuyển đổi answers từ object {questionId: answerIndex} thành array
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
        timeSpent: 0 // Có thể tính thời gian cho từng câu sau
      }));
      
      console.log('Converted answers array:', answersArray);

      const submitData = {
        answers: answersArray,
        timeSpent: test.totalTime * 60 - timeLeft
      };

      console.log('Submitting data:', submitData);

      const response = await testService.submitTest(testId, submitData);
      
      console.log('Submit response:', response);
      
      navigation.replace('JLPTTestResult', {
        result: response,
        test: test,
        questions: questions,
        answers: answers,
        testId: testId,
        timeSpent: test.totalTime * 60 - timeLeft
      });
      
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
      console.error('Error details:', error.message);
      openModal({
        title: 'Lỗi',
        type: 'error',
        message: `Không thể nộp bài thi: ${error.message || 'Vui lòng thử lại.'}`
      });
    } finally {
      setSubmitting(false);
    }
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

  const getQuestionTypeText = (type) => {
    const typeMap = {
      'moji_goi': '文字・語彙',
      'bunpou': '文法',
      'dokkai': '読解',
      'choukai': '聴解'
    };
    return typeMap[type] || type;
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    return (
      <View className="flex-1 p-4">
        {/* Question Header */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500">
              Câu {currentQuestionIndex + 1} / {questions.length}
            </Text>
            <Text className="text-sm bg-pink-100 text-pink-700 px-2 py-1 rounded">
              {getQuestionTypeText(question.type)}
            </Text>
          </View>
          
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            {question.questionText}
          </Text>
          
          {question.readingPassage && (
            <View className="bg-gray-100 rounded-lg p-4 mb-4">
              <Text className="text-gray-700">{question.readingPassage}</Text>
            </View>
          )}
          
          {question.imageFile && (
            <View className="bg-gray-100 rounded-lg p-4 mb-4 items-center">
              <Text className="text-gray-500">[Hình ảnh: {question.imageFile}]</Text>
            </View>
          )}
        </View>

        {/* Answer Options */}
        <View className="flex-1">
          {question.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`bg-white rounded-xl p-4 mb-3 shadow-md border-2 ${
                answers[question._id] === index
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-200'
              }`}
              onPress={() => handleAnswerSelect(question._id, index)}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    answers[question._id] === index
                      ? 'bg-pink-400'
                      : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      answers[question._id] === index ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text className="flex-1 text-gray-800 text-lg">
                  {option.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F472B6" />
        <Text className="text-lg text-gray-600 mt-4">Đang tải bài thi...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-b from-pink-400 to-pink-600 p-4">
        
        {/* Timer */}
        <View className="bg-white rounded-lg p-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Icon name="time-outline" size={20} color="#F472B6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">
              {formatTime(timeLeft)}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => setShowConfirmSubmit(true)}
            className="bg-pink-500 px-4 py-2 rounded-lg"
            disabled={submitting}
          >
            <Text className="text-white font-semibold">
              {submitting ? 'Đang nộp...' : 'Nộp bài'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Question Content */}
      <View className="flex-1">
        {renderQuestion()}
      </View>

      {/* Navigation */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex-row items-center px-4 py-2 rounded-lg ${
              currentQuestionIndex === 0
                ? 'bg-gray-200'
                : 'bg-pink-100'
            }`}
          >
            <Icon
              name="chevron-back"
              size={20}
              color={currentQuestionIndex === 0 ? '#ccc' : '#F472B6'}
            />
            <Text
              className={`ml-1 font-semibold ${
                currentQuestionIndex === 0 ? 'text-gray-400' : 'text-pink-700'
              }`}
            >
              Trước
            </Text>
          </TouchableOpacity>
          
          <Text className="text-gray-600">
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
          
          <TouchableOpacity
            onPress={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`flex-row items-center px-4 py-2 rounded-lg ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gray-200'
                : 'bg-pink-100'
            }`}
          >
            <Text
              className={`mr-1 font-semibold ${
                currentQuestionIndex === questions.length - 1 ? 'text-gray-400' : 'text-pink-700'
              }`}
            >
              Tiếp
            </Text>
            <Icon
              name="chevron-forward"
              size={20}
              color={currentQuestionIndex === questions.length - 1 ? '#ccc' : '#F472B6'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Question List Modal */}
      <Modal
        visible={showQuestionList}
        animationType="slide"
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-gray-800">
                  Danh sách câu hỏi
                </Text>
                <TouchableOpacity
                  onPress={() => setShowQuestionList(false)}
                  className="p-2"
                >
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="flex-1 p-4">
              <View className="grid grid-cols-5 gap-3">
                {questions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleQuestionNavigation(index)}
                    className={`w-12 h-12 rounded-lg items-center justify-center ${
                      answers[question._id] !== undefined
                        ? 'bg-green-500'
                        : currentQuestionIndex === index
                        ? 'bg-pink-500'
                        : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`font-bold ${
                        answers[question._id] !== undefined || currentQuestionIndex === index
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Confirm Submit Modal */}
      <Modal
        visible={showConfirmSubmit}
        animationType="fade"
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-white rounded-xl p-6 mx-4 w-80">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Nộp bài thi?
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Bạn có chắc chắn muốn nộp bài thi? Không thể thay đổi sau khi nộp.
            </Text>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowConfirmSubmit(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setShowConfirmSubmit(false);
                  submitTest();
                }}
                className="flex-1 bg-pink-500 py-3 rounded-lg ml-2"
                disabled={submitting}
              >
                <Text className="text-center font-semibold text-white">
                  {submitting ? 'Đang nộp...' : 'Nộp bài'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default JLPTTest; 