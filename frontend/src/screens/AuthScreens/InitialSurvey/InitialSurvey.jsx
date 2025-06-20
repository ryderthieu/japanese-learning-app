import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../context/AuthContext';
import { ModalContext } from '../../../context/ModalContext';
import { LoadingContext } from '../../../context/LoadingContext';

const InitialSurvey = ({ navigation }) => {
  const { updateUserInfo } = useAuth();
  const { openModal } = useContext(ModalContext);
  const { setIsLoading } = useContext(LoadingContext);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    jlptLevel: '',
    targetLevel: '',
    studyGoal: '',
    studyDuration: 30,
    reminderEnabled: true,
    reminderTime: '08:00'
  });
  
  const progress = useRef(new Animated.Value(0)).current;
  const totalSteps = 4;

  const jlptLevels = [
    { value: 'Beginner', label: 'Mới bắt đầu', icon: 'school-outline', description: 'Chưa có kiến thức tiếng Nhật' },
    { value: 'N5', label: 'N5 - Sơ cấp', icon: 'leaf-outline', description: 'Hiểu được các cụm từ và câu cơ bản' },
    { value: 'N4', label: 'N4 - Tiền trung cấp', icon: 'walk-outline', description: 'Hiểu được tiếng Nhật cơ bản' },
    { value: 'N3', label: 'N3 - Trung cấp', icon: 'bicycle-outline', description: 'Hiểu được tiếng Nhật hàng ngày' },
    { value: 'N2', label: 'N2 - Trung cấp cao', icon: 'car-outline', description: 'Hiểu được tiếng Nhật trong nhiều tình huống' },
    { value: 'N1', label: 'N1 - Cao cấp', icon: 'rocket-outline', description: 'Hiểu được tiếng Nhật trong mọi tình huống' }
  ];

  const targetLevels = jlptLevels.filter(level => level.value !== 'Beginner');

  const studyGoals = [
    { value: 'work', label: 'Hỗ trợ công việc', icon: 'briefcase-outline' },
    { value: 'study', label: 'Du học Nhật Bản', icon: 'school-outline' },
    { value: 'travel', label: 'Du lịch Nhật Bản', icon: 'airplane-outline' },
    { value: 'hobby', label: 'Sở thích cá nhân', icon: 'heart-outline' },
    { value: 'exam', label: 'Thi JLPT', icon: 'trophy-outline' },
    { value: 'other', label: 'Mục đích khác', icon: 'ellipsis-horizontal-outline' }
  ];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentStep + 1) / totalSteps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Validate data
    if (!surveyData.jlptLevel) {
      openModal({ type: 'error', message: 'Vui lòng chọn trình độ hiện tại' });
      return;
    }

    if (!surveyData.targetLevel) {
      openModal({ type: 'error', message: 'Vui lòng chọn mục tiêu' });
      return;
    }

    if (!surveyData.studyGoal) {
      openModal({ type: 'error', message: 'Vui lòng chọn mục đích học tập' });
      return;
    }

    // Check target level logic
    if (surveyData.jlptLevel !== 'Beginner') {
      const levels = ['Beginner', 'N5', 'N4', 'N3', 'N2', 'N1'];
      const currentIndex = levels.indexOf(surveyData.jlptLevel);
      const targetIndex = levels.indexOf(surveyData.targetLevel);
      
      if (targetIndex <= currentIndex) {
        openModal({ type: 'error', message: 'Mục tiêu phải cao hơn trình độ hiện tại' });
        return;
      }
    }

    try {
      setIsLoading(true);
      await updateUserInfo({
        jlptLevel: surveyData.jlptLevel,
        targetLevel: surveyData.targetLevel,
        studyGoal: surveyData.studyGoal,
        studySettings: {
          studyDuration: surveyData.studyDuration,
          reminder: {
            enabled: surveyData.reminderEnabled,
            time: surveyData.reminderTime
          }
        },
        hasCompletedInitialSurvey: true
      });
      
      openModal({
        type: 'success',
        message: 'Chào mừng bạn đến với ứng dụng học tiếng Nhật! Hãy bắt đầu hành trình học tập của bạn.'
      });
    } catch (error) {
      console.error('Error completing survey:', error);
      openModal({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return surveyData.jlptLevel !== '';
      case 1: return surveyData.targetLevel !== '';
      case 2: return surveyData.studyGoal !== '';
      case 3: return surveyData.studyDuration >= 5;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Trình độ hiện tại
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Hãy cho chúng tôi biết trình độ tiếng Nhật hiện tại của bạn
            </Text>
            
            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
              {jlptLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  onPress={() => setSurveyData({ ...surveyData, jlptLevel: level.value })}
                  className={`flex-row items-center p-4 mb-3 rounded-2xl border-2 ${
                    surveyData.jlptLevel === level.value 
                      ? 'bg-pink-50 border-pink-400' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon 
                    name={level.icon} 
                    size={24} 
                    color={surveyData.jlptLevel === level.value ? '#EC4899' : '#6B7280'} 
                  />
                  <View className="flex-1 ml-3">
                    <Text className={`font-semibold text-base ${
                      surveyData.jlptLevel === level.value ? 'text-pink-600' : 'text-gray-700'
                    }`}>
                      {level.label}
                    </Text>
                    <Text className="text-gray-500 text-sm">{level.description}</Text>
                  </View>
                  {surveyData.jlptLevel === level.value && (
                    <Icon name="checkmark-circle" size={20} color="#EC4899" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 1:
        return (
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Mục tiêu của bạn
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Bạn muốn đạt đến trình độ nào?
            </Text>
            
            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
              {targetLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  onPress={() => setSurveyData({ ...surveyData, targetLevel: level.value })}
                  className={`flex-row items-center p-4 mb-3 rounded-2xl border-2 ${
                    surveyData.targetLevel === level.value 
                      ? 'bg-pink-50 border-pink-400' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon 
                    name={level.icon} 
                    size={24} 
                    color={surveyData.targetLevel === level.value ? '#EC4899' : '#6B7280'} 
                  />
                  <View className="flex-1 ml-3">
                    <Text className={`font-semibold text-base ${
                      surveyData.targetLevel === level.value ? 'text-pink-600' : 'text-gray-700'
                    }`}>
                      {level.label}
                    </Text>
                    <Text className="text-gray-500 text-sm">{level.description}</Text>
                  </View>
                  {surveyData.targetLevel === level.value && (
                    <Icon name="checkmark-circle" size={20} color="#EC4899" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 2:
        return (
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Mục đích học tập
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Tại sao bạn muốn học tiếng Nhật?
            </Text>
            
            <View className="flex-row flex-wrap justify-between">
              {studyGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.value}
                  onPress={() => setSurveyData({ ...surveyData, studyGoal: goal.value })}
                  className={`w-[48%] p-4 mb-4 rounded-2xl border-2 items-center ${
                    surveyData.studyGoal === goal.value 
                      ? 'bg-pink-50 border-pink-400' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon 
                    name={goal.icon} 
                    size={32} 
                    color={surveyData.studyGoal === goal.value ? '#EC4899' : '#6B7280'} 
                  />
                  <Text className={`text-center mt-2 font-medium ${
                    surveyData.studyGoal === goal.value ? 'text-pink-600' : 'text-gray-700'
                  }`}>
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Cài đặt học tập
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              Thiết lập thời gian học mỗi ngày và nhắc nhở
            </Text>
            
            <View className="bg-white rounded-2xl p-4 mb-4">
              <Text className="font-semibold text-gray-700 mb-3">Thời gian học mỗi ngày</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base"
                  value={surveyData.studyDuration.toString()}
                  onChangeText={(value) => setSurveyData({ 
                    ...surveyData, 
                    studyDuration: parseInt(value) || 0 
                  })}
                  keyboardType="numeric"
                  placeholder="30"
                />
                <Text className="text-gray-600 ml-3">phút</Text>
              </View>
              <Text className="text-gray-500 text-sm mt-2">
                Khuyến nghị: 15-60 phút mỗi ngày
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-semibold text-gray-700">Nhắc nhở hàng ngày</Text>
                <TouchableOpacity
                  onPress={() => setSurveyData({
                    ...surveyData,
                    reminderEnabled: !surveyData.reminderEnabled
                  })}
                  className={`w-12 h-6 rounded-full p-0.5 ${
                    surveyData.reminderEnabled ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <View className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    surveyData.reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </TouchableOpacity>
              </View>
              
              {surveyData.reminderEnabled && (
                <View className="flex-row items-center">
                  <Icon name="time-outline" size={20} color="#EC4899" />
                  <Text className="ml-2 text-gray-600">Lúc</Text>
                  <TextInput
                    className="ml-2 border border-gray-200 rounded-lg px-3 py-2 text-center min-w-[80px]"
                    value={surveyData.reminderTime}
                    onChangeText={(value) => setSurveyData({
                      ...surveyData,
                      reminderTime: value
                    })}
                    placeholder="08:00"
                  />
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header với thanh tiến trình */}
      <View className="bg-white px-5 py-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">Thiết lập tài khoản</Text>
          <Text className="text-gray-500">{currentStep + 1}/{totalSteps}</Text>
        </View>
        
        <View className="w-full h-2 bg-gray-200 rounded-full">
          <Animated.View
            className="h-2 bg-pink-500 rounded-full"
            style={{
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 py-6">
        {renderStep()}
      </ScrollView>

      {/* Navigation buttons */}
      <View className="bg-white px-5 py-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          {currentStep > 0 ? (
            <TouchableOpacity
              onPress={handlePrevious}
              className="bg-gray-200 px-6 py-3 rounded-xl"
            >
              <Text className="text-gray-700 font-medium">Quay lại</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          
          <TouchableOpacity
            onPress={handleNext}
            disabled={!isStepValid()}
            className={`px-6 py-3 rounded-xl ${
              isStepValid() ? 'bg-pink-500' : 'bg-gray-300'
            }`}
          >
            <Text className={`font-medium ${
              isStepValid() ? 'text-white' : 'text-gray-500'
            }`}>
              {currentStep === totalSteps - 1 ? 'Hoàn thành' : 'Tiếp tục'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default InitialSurvey; 