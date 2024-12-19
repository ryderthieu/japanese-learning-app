import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import CircularProgress from './CircularProgress';
import Slider from '../../../components/SlideCarousel/Slider';
import SliderData from '../../../components/SlideCarousel/SliderData';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = ({ navigation }) => {
  return (
    <ScrollView className="flex flex-col pt-5" showsVerticalScrollIndicator={false}>
        <View className="mb-3">
          <Slider itemList={SliderData} />
        </View>

        <View className="flex-row items-center justify-between bg-white mx-5 p-4 rounded-xl shadow-md mb-6">
          <Image
            source={require('../../../assets/images/home/learned-time.png')}
            className="w-16 h-16"
          />
          <View className="flex-1 ml-5">
            <Text className="text-lg font-semibold text-[#2B308B]">
              Thời gian đã học hôm nay
            </Text>
            <Text className="text-3xl font-bold text-[#2B308B]">
              3/
              <Text className="text-2xl font-bold text-[#2B308B]">
                10{' '}
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
              onPress={() => navigation.navigate('FreeDocumentNavigation')}
            >
              <Image
                source={require('../../../assets/images/home/document.png')}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">
                Tài liệu {'\n'}offline
              </Text>
            </TouchableOpacity>
            <View className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4">
              <Image
                source={require('../../../assets/images/home/online_course.png')}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">
                Khóa học {'\n'}online
              </Text>
            </View>
          </View>

          <View className="flex-row justify-around mt-5 gap-4">
            <TouchableOpacity className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4">
              <Image
                source={require('../../../assets/images/home/test.png')}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">Thi thử</Text>
            </TouchableOpacity>
            <View className="flex flex-row items-center justify-around gap-2 flex-1 h-24 bg-white rounded-2xl shadow-md p-4">
              <Image
                source={require('../../../assets/images/home/search.png')}
                className="w-12 h-12"
              />
              <Text className="font-semibold text-lg text-[#2B308B]">Tra từ</Text>
            </View>
          </View>
        </View>

        <View className="mx-5 mt-10">
          <Text className="text-3xl font-bold text-[#2B308B]">Lịch sử</Text>
          <View className="flex-row justify-end gap-5 mb-5">
            <Text className="px-7 py-2 bg-white rounded-3xl text-[#2B308B] font-semibold">
              Bài học
            </Text>
            <Text className="px-7 py-2 bg-white rounded-3xl text-[#2B308B] font-semibold">
              Thi thử
            </Text>
          </View>
          <View className="bg-white rounded-3xl h-28 justify-center items-center shadow-md">
            <Text className="text-center text-gray-500">Bạn chưa học</Text>
          </View>
        </View>

        <View className="mx-5 mt-10 mb-10">
          <Text className="text-3xl font-bold text-[#2B308B] mb-5">Đã lưu</Text>
          <View className="flex-row justify-between">
            <View className="flex flex-col justify-center items-center w-[110px] h-[110px] bg-white rounded-3xl shadow-md">
              <View className="flex w-[60px] h-[60px] justify-center items-center mt-4 bg-secondary rounded-2xl">
                <Text className="font-bold text-white text-4xl">10</Text>
              </View>
              <Text className="font-bold text-xl mt-2 text-[#2B308B]">Từ vựng</Text>
            </View>
            <View className="flex flex-col justify-center items-center w-[110px] h-[110px] bg-white rounded-3xl shadow-md">
              <View className="w-[60px] h-[60px] justify-center items-center mt-4 bg-secondary rounded-2xl">
                <Text className="font-bold text-white text-4xl">15</Text>
              </View>
              <Text className="font-bold text-xl mt-2 text-[#2B308B]">Ngữ pháp</Text>
            </View>
            <View className="flex flex-col justify-center items-center w-[110px] h-[110px] bg-white rounded-3xl shadow-md">
              <View className="w-[60px] h-[60px] justify-center items-center mt-4 bg-secondary rounded-2xl">
                <Text className="font-bold text-white text-4xl">17</Text>
              </View>
              <Text className="font-bold text-xl mt-2 text-[#2B308B]">Câu hỏi</Text>
            </View>
          </View>
        </View>
    </ScrollView>
  );
};

export default Home;
