import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import testService from '../../../api/testService';
import userService from '../../../api/userService';
import { useAIExplanation } from '../../../context/AIExplanationContext';

const JLPTTestReview = ({ navigation, route }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userTestResult, setUserTestResult] = useState(null);
  const { testId, test, questions: passedQuestions, answers: passedAnswers, result } = route.params || {};
  
  const { showExplanation } = useAIExplanation();

  useEffect(() => {    
    console.log('JLPTTestReview mounted with params:', route.params);
    
    // Nếu có dữ liệu được truyền qua props, sử dụng trực tiếp
    if (passedQuestions && passedAnswers) {
      console.log('Using passed data directly');
      setQuestions(passedQuestions);
      setAnswers(passedAnswers);
      setUserTestResult(result);
      setLoading(false);
    }
    // Nếu có testId, luôn fetch để lấy dữ liệu mới nhất  
    else if (testId) {
      console.log('Fetching data for testId:', testId);
      fetchTestDataAndResults();
    } else {
      console.log('No data provided, setting loading to false');
      setLoading(false);
    }
  }, []);

  const fetchTestDataAndResults = async () => {  
    try {
      setLoading(true);
      console.log('Starting fetch for testId:', testId);
      
      const targetTestId = testId;
      
      // Lấy thông tin bài thi và kết quả user song song
      const [testDetails, userHistory] = await Promise.all([
        testService.getTestById(targetTestId),
        userService.getTestHistory().catch(err => {
          console.log('Error getting user history, using empty data:', err);
          return { testAttempts: [] };
        })
      ]);

      console.log('Test details:', testDetails);
      console.log('User history:', userHistory);

      // Xử lý questions
      let allQuestions = [];
      if (testDetails.sections && testDetails.sections.length > 0) {
        // Flatten questions from sections
        allQuestions = testDetails.sections.reduce((acc, section) => {
          if (section.questions && section.questions.length > 0) {
            return acc.concat(section.questions.map(q => q.questionId || q));
          }
          return acc;
        }, []);
      } else if (testDetails.questions && testDetails.questions.length > 0) {
        // Direct questions array
        allQuestions = testDetails.questions;
      }
      
      console.log('Processed questions:', allQuestions.length);
      
      // Tạo fallback questions nếu không có dữ liệu
      if (allQuestions.length === 0) {
        console.log('No questions found, creating fallback questions');
        allQuestions = [
          {
            _id: 'fallback1',
            questionText: 'Đây là câu hỏi mẫu để hiển thị giao diện review',
            type: 'vocabulary',
            section: 'moji_goi',
            options: [
              { text: 'Tùy chọn A', isCorrect: true },
              { text: 'Tùy chọn B', isCorrect: false },
              { text: 'Tùy chọn C', isCorrect: false },
              { text: 'Tùy chọn D', isCorrect: false }
            ],
            explanation: 'Đây là giải thích mẫu cho câu hỏi'
          }
        ];
        setAnswers([{
          questionId: 'fallback1',
          selectedOption: 1,
          isCorrect: false
        }]);
      }
      
      setQuestions(allQuestions);
      
      // Tìm kết quả gần nhất của user cho bài thi này
      const userAttempts = userHistory.testAttempts || [];

      const latestAttempt = userAttempts.find(attempt => {
        const attemptTestId = attempt.testId?._id || attempt.testId;
        return attemptTestId === targetTestId || attemptTestId?.toString() === targetTestId?.toString();
      });
      
      console.log('Latest attempt found:', latestAttempt);
      
      if (latestAttempt) {
        setAnswers(latestAttempt.answers || []);
        setUserTestResult({
          score: latestAttempt.score,
          maxScore: latestAttempt.maxScore,
          timeSpent: latestAttempt.timeSpent,
          completedAt: latestAttempt.completedAt
        });
      } else {
        console.log('No attempt found for testId:', targetTestId);
        // Thay vì hiển thị alert, tạo dữ liệu fallback
        setAnswers([]);
        setUserTestResult({
          score: 0,
          maxScore: 100,
          timeSpent: 0,
          completedAt: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error('Error fetching test data and results:', error);
      
      // Tạo dữ liệu fallback nếu API hoàn toàn thất bại
      const fallbackQuestions = [
        {
          _id: 'error1',
          questionText: 'Không thể tải dữ liệu bài thi. Đây là câu hỏi mẫu.',
          type: 'vocabulary',
          section: 'moji_goi',
          options: [
            { text: 'Tùy chọn A', isCorrect: true },
            { text: 'Tùy chọn B', isCorrect: false },
            { text: 'Tùy chọn C', isCorrect: false },
            { text: 'Tùy chọn D', isCorrect: false }
          ],
          explanation: 'Có lỗi xảy ra khi tải dữ liệu bài thi'
        }
      ];
      
      setQuestions(fallbackQuestions);
      setAnswers([{
        questionId: 'error1',
        selectedOption: 2,
        isCorrect: false
      }]);
      setUserTestResult({
        score: 0,
        maxScore: 100,
        timeSpent: 0,
        completedAt: new Date().toISOString()
      });
      
      Alert.alert('Thông báo', 'Có lỗi khi tải dữ liệu. Hiển thị dữ liệu mẫu để xem giao diện.');
    } finally {
      setLoading(false);
    }
  };

  const getSectionName = (sectionKey) => {
    const sectionNames = {
      'moji_goi': '文字・語彙',
      'bunpou': '文法', 
      'dokkai': '読解',
      'choukai': '聴解'
    };
    return sectionNames[sectionKey] || sectionKey;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAIExplanation = (question, questionNumber) => {
    const correctAnswerIndex = question.options?.findIndex(opt => opt.isCorrect);
    
    const questionData = {
      questionText: question.questionText,
      options: question.options,
      correctAnswer: correctAnswerIndex,
      section: question.type || question.section,
      level: 'N5', // Có thể lấy từ test data
      questionNumber: questionNumber
    };
    
    showExplanation(questionData, 'question');
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    
    if (!question) return null;

    // Cải thiện cách tìm answerData
    let answerData = null;
    if (answers && answers.length > 0) {
      // Thử match theo nhiều cách với xử lý questionId dạng object
      answerData = answers.find(a => {
        const questionIdStr = question._id?.toString();
        
        // Xử lý trường hợp questionId là object có _id
        let answerQuestionIdStr;
        if (a.questionId && typeof a.questionId === 'object' && a.questionId._id) {
          answerQuestionIdStr = a.questionId._id.toString();
        } else {
          answerQuestionIdStr = a.questionId?.toString();
        }
        
        return questionIdStr === answerQuestionIdStr;
      });
      
    }

    const userSelectedOption = answerData?.selectedOption;
    const isCorrect = answerData?.isCorrect;
    const correctOption = question.options?.findIndex(opt => opt.isCorrect);

    return (
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Question Header */}
        <View className="bg-white rounded-xl p-5 mb-6 shadow-md">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-gray-500 font-medium">
              Câu {currentQuestionIndex + 1} / {questions.length}
            </Text>
            <View className="flex-row items-center">
              {answerData ? (
                <View className={`px-3 py-1.5 rounded-full mr-3 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Text className={`text-xs font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'ĐÚNG' : 'SAI'}
                  </Text>
                </View>
              ) : (
                <View className="px-3 py-1.5 rounded-full mr-3 bg-gray-100">
                  <Text className="text-xs font-bold text-gray-600">
                    KHÔNG CÓ DỮ LIỆU
                  </Text>
                </View>
              )}
              <Text className="text-sm bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full font-medium">
                {getSectionName(question.type || question.section)}
              </Text>
            </View>
          </View>

          {/* Answer Summary */}
         
          
          <Text className="text-lg font-semibold text-gray-800 mb-4 leading-6">
            {question.questionText}
          </Text>
          
          {question.readingPassage && (
            <View className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <Text className="text-gray-700 leading-6">{question.readingPassage}</Text>
            </View>
          )}
          
          {question.imageFile && (
            <View className="bg-gray-50 rounded-lg p-6 mb-4 items-center border border-gray-200">
              <Icon name="image-outline" size={32} color="#999" />
              <Text className="text-gray-500 mt-2 text-center">[Hình ảnh: {question.imageFile}]</Text>
            </View>
          )}
        </View>

        {/* Answer Options */}
        <View className="mb-6">
          {/* Options */}
          <View>
            {question.options?.map((option, index) => {
              const isUserChoice = userSelectedOption === index;
              const isCorrectAnswer = index === correctOption;
              
              // Xác định style dựa trên trạng thái đáp án
              let backgroundColor = 'bg-white';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-800';
              let iconName = '';
              let iconColor = '#666';
              let optionCircleColor = 'bg-gray-200';
              let showUserLabel = false;
              let showCorrectLabel = false;

              if (isCorrectAnswer && isUserChoice) {
                // Đáp án đúng và user cũng chọn đúng
                backgroundColor = 'bg-blue-50';
                borderColor = 'border-blue-400';
                iconName = 'checkmark-circle';
                iconColor = '#2196F3';
                optionCircleColor = 'bg-blue-400';
                showUserLabel = true;
                showCorrectLabel = true;
              } else if (isCorrectAnswer) {
                // Đáp án đúng nhưng user không chọn
                backgroundColor = 'bg-green-50';
                borderColor = 'border-green-400';
                iconName = 'checkmark-circle';
                iconColor = '#4CAF50';
                optionCircleColor = 'bg-green-400';
                showCorrectLabel = true;
              } else if (isUserChoice && answerData) {
                // User chọn nhưng sai
                backgroundColor = 'bg-red-50';
                borderColor = 'border-red-400';
                iconName = 'close-circle';
                iconColor = '#F44336';
                optionCircleColor = 'bg-red-400';
                showUserLabel = true;
              }

              return (
                <View
                  key={index}
                  className={`${backgroundColor} rounded-xl p-4 shadow-sm border-2 ${borderColor} mb-3`}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${optionCircleColor}`}
                    >
                      <Text
                        className={`font-bold ${
                          isCorrectAnswer || (isUserChoice && answerData) ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className={`text-lg leading-6 ${textColor} mb-2`}>
                        {option.text}
                      </Text>
                      
                      {/* Labels */}
                      <View className="flex-row flex-wrap">
                        {showCorrectLabel && (
                          <View className="bg-green-100 px-2 py-1 rounded-full mr-2 mb-1">
                            <Text className="text-xs font-semibold text-green-700">
                              ✓ Đáp án đúng
                            </Text>
                          </View>
                        )}
                        {showUserLabel && (
                          <View className={`px-2 py-1 rounded-full mr-2 mb-1 ${
                            isCorrectAnswer ? 'bg-blue-100' : 'bg-red-100'
                          }`}>
                            <Text className={`text-xs font-semibold ${
                              isCorrectAnswer ? 'text-blue-700' : 'text-red-700'
                            }`}>
                              {isCorrectAnswer ? '👤 Bạn chọn đúng' : '👤 Bạn đã chọn'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    {iconName && (
                      <Icon name={iconName} size={24} color={iconColor} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Explanation */}
        {question.explanation && (
          <View className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Icon name="information-circle" size={22} color="#2196F3" />
                <Text className="text-blue-700 font-semibold ml-2 text-base">Giải thích</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAIExplanation(question, currentQuestionIndex + 1)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-lg flex-row items-center"
                style={{
                  backgroundColor: '#FF4081',
                  shadowColor: '#FF4081',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Icon name="chatbubble-ellipses" size={16} color="white" />
                <Text className="text-white font-semibold ml-2 text-sm">Hỏi AI</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-blue-800 leading-6">{question.explanation}</Text>
          </View>
        )}

        {/* Nếu không có explanation sẵn, hiển thị nút hỏi AI */}
        {!question.explanation && (
          <View className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-600 font-medium mb-2">Cần giải thích chi tiết?</Text>
                <Text className="text-gray-500 text-sm">AI sẽ phân tích câu hỏi và giải thích tại sao đáp án này đúng</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleAIExplanation(question, currentQuestionIndex + 1)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-lg flex-row items-center ml-4"
                style={{
                  backgroundColor: '#FF4081',
                  shadowColor: '#FF4081',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Icon name="chatbubble-ellipses" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Hỏi AI giải thích</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom spacing để tránh bị che bởi navigation */}
        <View className="h-4" />
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#F490AF" />
          <Text className="text-lg text-gray-600 mt-4">Đang tải dữ liệu...</Text>
          <Text className="text-sm text-gray-500 mt-2 text-center px-8">
            Đang lấy câu hỏi và kết quả của bạn
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View className="flex-1 justify-center items-center bg-gray-50">
          <Icon name="alert-circle-outline" size={64} color="#ccc" />
          <Text className="text-lg text-gray-600 mt-4">Không có dữ liệu để xem lại</Text>
          <Text className="text-sm text-gray-500 mt-2 text-center px-8">
            Bài thi chưa có câu hỏi hoặc bạn chưa làm bài thi này
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4 bg-pink-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderQuestion()}

      {/* Navigation */}
      <View className="bg-white border-t border-gray-200 px-4 py-5">         
        <View className="mb-2">
          <Text className="text-sm font-medium text-gray-600 mb-3">Danh sách câu hỏi:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {questions.map((question, index) => {
                // Sử dụng logic matching giống như trong renderQuestion
                const answerData = answers?.find(a => {
                  const questionIdStr = question._id?.toString();
                  
                  // Xử lý trường hợp questionId là object có _id
                  let answerQuestionIdStr;
                  if (a.questionId && typeof a.questionId === 'object' && a.questionId._id) {
                    answerQuestionIdStr = a.questionId._id.toString();
                  } else {
                    answerQuestionIdStr = a.questionId?.toString();
                  }
                  
                  return questionIdStr === answerQuestionIdStr;
                });
                
                const isCorrect = answerData?.isCorrect;
                
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleQuestionNavigation(index)}
                    className={`w-12 h-12 rounded-xl items-center justify-center shadow-sm mr-3 ${
                      index === currentQuestionIndex
                        ? 'bg-blue-500 border-2 border-blue-300'
                        : answerData && isCorrect
                        ? 'bg-green-500'
                        : answerData
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    <Text className="font-bold text-white text-sm">
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default JLPTTestReview; 