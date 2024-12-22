import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Animated } from "react-native";
import { ModalContext } from "../../../context/ModalContext";
import SurveyOption from "./SurveyOption";
import SurveyData from "./SurveyData";

const Survey = ({navigation}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Câu hỏi hiện tại
  const [selectedOption, setSelectedOption] = useState(null); // Option được chọn
  const progress = useRef(new Animated.Value(0)).current; // Animated value cho thanh tiến trình
  const {openModal} = useContext(ModalContext)

  const currentQuestion = SurveyData[currentQuestionIndex];

  // Xử lý sự kiện "Tiếp tục"
  const handleNext = () => {
    if (currentQuestionIndex < SurveyData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset lựa chọn

      // Animate thanh tiến trình khi chuyển câu hỏi
      Animated.timing(progress, {
        toValue: (currentQuestionIndex + 1) / SurveyData.length, // Tính toán giá trị tiến trình
        duration: 500, // Thời gian animation
        useNativeDriver: false, // Đảm bảo sử dụng CSS mà không cần thay đổi kiểu Layout
      }).start();
    } else {
      // Kết thúc khảo sát
      openModal({type: 'success', message: 'Cảm ơn bạn đã tham gia khảo sát!'})
      navigation.navigate('Home')
    }
  };

  // Update thanh tiến trình khi câu hỏi thay đổi
  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentQuestionIndex + 1) / SurveyData.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  return (
      <View className="flex flex-col w-screen h-screen px-2 py-5 bg-slate-100">
        {/* Thanh tiến trình */}
        <View className="w-full h-2 mt-8 mb-5 bg-gray-300 rounded-full">
          <Animated.View
            className="h-2 bg-green-500 rounded-full"
            style={{
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'], // Dễ dàng đổi qua lại từ 0% đến 100%
              }),
            }}
          />
        </View>

        <ScrollView className="flex-grow px-2 py-5" showsVerticalScrollIndicator={false}>
          <View className="flex flex-row px-2 gap-3 mb-16">
            {/* Hình hoa anh đào */}
            <Image
              source={require("../../../assets/images/CheckYourLevel/logo-noTitle.png")}
              className="basis-1/4"
            />
            {/* Hộp thoại */}
            <View className="basis-3/4 p-5 rounded-xl border border-gray-300">
              <Text className="text-gray-700 text-xl text-justify">{currentQuestion.question}</Text>
            </View>
          </View>

          {currentQuestion.options.map((option) => (
            <SurveyOption
              key={option.id}
              icon={option.icon}
              text={option.text}
              isSelected={selectedOption === option.id} // Xác định nếu option được chọn
              onPress={() => setSelectedOption(option.id)} // Đặt option được chọn
            />
          ))}
        </ScrollView>
        <TouchableOpacity
          className="flex justify-end mb-20 px-2"
          onPress={handleNext}
          disabled={!selectedOption} // Vô hiệu hóa nếu chưa chọn option
        >
          <Text className="bg-pink-300 text-white font-bold text-2xl rounded-2xl text-center p-3 opacity-95">
            {currentQuestionIndex < SurveyData.length - 1 ? "Tiếp tục" : "Hoàn thành"}
          </Text>
        </TouchableOpacity>
      </View>
  );
};

export default Survey;
