import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from './CircularProgress';
import Slider from '../../../components/SlideCarousel/Slider';
import SliderData from '../../../components/SlideCarousel/SliderData';
import { AuthContext } from '../../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import userService from '../../../api/userService';

const Home = ({ navigation }) => {
  const { token } = useContext(AuthContext)
  const [savedVocabulary, setSavedVocabulary] = useState([]);
  const [savedGrammar, setSavedGrammar] = useState([])
  const [jlptStats, setJlptStats] = useState(null);
  const isFocus = useIsFocused()

  const fetchSavedData = async () => {
    try {
      const response = await userService.getUserInfo();
      setSavedVocabulary(response.savedVocabulary);
      setSavedGrammar(response.savedGrammar)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  };

  const fetchJLPTStats = async () => {
    try {
      const stats = await userService.getJLPTStats();
      setJlptStats(stats);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê JLPT:', error);
    }
  };

  useEffect(() => {
    fetchSavedData();
    fetchJLPTStats();
  }, [isFocus])

  return (
    <ScrollView
      className="flex flex-col pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View>
        <View className="mb-3">
          <Slider itemList={SliderData} />
        </View>
        <View className="flex-row items-center justify-between p-4 bg-white borderrounded-lg shadow-lg mx-5 mb-6 rounded-xl">
          <View>
            <Text className="text-lg font-bold text-[#2B308B]">KHẢO SÁT</Text>
            <Text className="text-sm text-gray-500">
              Giúp chúng tôi hiểu bạn hơn
            </Text>
          </View>
          <TouchableOpacity className="px-4 py-2 border border-[#2B308B] rounded-md" onPress={() => navigation.navigate('SurveyNavigation')}>
            <Text className="text-[#2B308B] font-semibold">Bắt đầu</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between bg-white mx-5 p-4 rounded-xl shadow-md mb-6">
          <Image
            source={require("../../../assets/images/home/learned-time.png")}
            className="w-16 h-16"
          />
          <View className="flex-1 ml-5">
            <Text className="text-lg font-semibold text-[#2B308B]">
              Thời gian đã học hôm nay
            </Text>
            <Text className="text-3xl font-bold text-[#2B308B]">
              3/
              <Text className="text-2xl font-bold text-[#2B308B]">
                10{" "}
                <Text className="text-xl font-bold text-gray-500">minutes</Text>
              </Text>
            </Text>
          </View>
          <CircularProgress percentage={20} />
        </View>

        <View className="mx-5">
          <Text className="text-3xl font-bold text-[#2B308B] mb-5">
            Danh mục
          </Text>

          <View className="flex-row justify-around gap-4">
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4"
              onPress={() => navigation.navigate("FreeDocumentNavigation")}
            >
              <Image
                source={require("../../../assets/images/home/document.png")}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">
                Tài liệu {"\n"}offline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4"
              onPress={() => navigation.navigate("CoursesNavigation")}
            >
              <Image
                source={require("../../../assets/images/home/online_course.png")}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">
                Khóa học {"\n"}online
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around mt-5 gap-4">
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4"
              onPress={() => navigation.navigate("JLPTNavigation")}
            >
              <Image
                source={require("../../../assets/images/home/test.png")}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">
                Thi thử
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4"
              onPress={() => navigation.navigate("Dictionary")}
            >
              <Image
                source={require("../../../assets/images/home/search.png")}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">
                Tra từ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* JLPT Quick Stats */}
        {jlptStats && (
          <View className="mx-5 mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-[#2B308B]">Tiến độ thi thử</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate("JLPTNavigation")}
                className="px-3 py-1 bg-pink-100 rounded-full"
              >
                <Text className="text-pink-600 font-semibold text-sm">Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-white rounded-xl p-4 shadow-md">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-gray-800">Tiến độ tổng thể</Text>
                <Text className="text-2xl font-bold text-pink-500">
                  {jlptStats.overallProgress || 0}%
                </Text>
              </View>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-xl font-bold text-green-500">
                    {jlptStats.completedTests || 0}
                  </Text>
                  <Text className="text-sm text-gray-600">Bài thi</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-500">
                    {jlptStats.learnedWords || 0}
                  </Text>
                  <Text className="text-sm text-gray-600">Từ vựng</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-orange-500">
                    {jlptStats.studyDays || 0}
                  </Text>
                  <Text className="text-sm text-gray-600">Ngày học</Text>
                </View>
              </View>
            </View>
          </View>
        )}

      </View>

      <View className="mx-5 mt-10 mb-10">
        <Text className="text-3xl font-bold text-[#2B308B] mb-5">Đã lưu</Text>
        <View className="flex-row justify-around">
          <TouchableOpacity className="flex flex-col justify-center items-center w-[140px] h-[140px] bg-white rounded-3xl shadow-md" onPress={() => navigation.navigate('SavedVocabulary', {savedVocabulary})}>
            <View className="flex w-[60px] h-[60px] justify-center items-center mt-4 bg-secondary rounded-2xl">
              <Text className="font-bold text-white text-4xl">{savedVocabulary.length}</Text>
            </View>
            <Text className="font-bold text-xl mt-2 text-[#2B308B]">
              Từ vựng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col justify-center items-center w-[140px] h-[140px] bg-white rounded-3xl shadow-md" onPress={() => navigation.navigate('SavedGrammar', {savedGrammar})}>
            <View className="w-[60px] h-[60px] justify-center items-center mt-4 bg-secondary rounded-2xl">
              <Text className="font-bold text-white text-4xl">{savedGrammar.length}</Text>
            </View>
            <Text className="font-bold text-xl mt-2 text-[#2B308B]">
              Ngữ pháp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
