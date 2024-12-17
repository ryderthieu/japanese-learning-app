import { Text, View, Image, ScrollView} from "react-native";
import React from "react";
import CircularProgress from "./CircularProgress";
import Slider from "../../../components/SlideCarousel/Slider";
import SliderData from "../../../components/SlideCarousel/SliderData";
import { TouchableOpacity } from "react-native";
import Header from "./Header";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = ({navigation}) => {
  return (
    <SafeAreaView>
      <ScrollView>
      <Header />
        <View>
          <View>
            <Slider itemList={SliderData} />
          </View>
          <View className="flex-1 flex-col px-2 pb-5 bg-gray-100">
            <View className="flex flex-row py-5 items-center justify-center bg-white rounded-3xl shadow shadow-slate-300 ">
              <View className="basis-1/4">
                <Image
                  source={require("../../../assets/images/home/learned-time.png")}
                ></Image>
              </View>
              <View className="flex-col gap-5">
                <Text className="text-xl font-semibold">
                  Thời gian đã học hôm nay
                </Text>
                <Text className="text-4xl font-bold">
                  3/
                  <Text className="text-2xl font-bold">
                    10{" "}
                    <Text className="text-xl font-bold text-gray-500">
                      minutes
                    </Text>
                  </Text>
                </Text>
              </View>
              <View>
                <CircularProgress percentage={20} />
              </View>
            </View>
            <View className="flex flex-col gap-3">
              <Text className="text-3xl text-[#2B308B] font-bold ">
                Danh mục
              </Text>
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="flex flex-row justify-between items-center gap-2 px-3 w-[180px] h-24 bg-white rounded-2xl shadow shadow-slate-300 " onPress={() => navigation.navigate('FreeDocumentNavigation')}>
                  <Image
                    source={require("../../../assets/images/home/document.png")}
                  ></Image>
                  <Text className="font-semibold text-lg">
                    Tài liệu {"\n"} offline
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row justify-between items-center gap-2 px-3 w-[180px] h-24 bg-white rounded-2xl shadow shadow-slate-300 ">
                  <Image
                    source={require("../../../assets/images/home/online_course.png")}
                  ></Image>
                  <Text className="font-semibold text-lg">
                    Khóa học {"\n"} online
                  </Text>
                </View>
              </View>
              <View className="flex flex-row justify-between">
                <TouchableOpacity>
                  <View className="flex flex-row justify-between items-center gap-2 px-3 w-[180px] h-24 bg-white rounded-2xl shadow shadow-slate-300 ">
                    <Image
                      source={require("../../../assets/images/home/test.png")}
                    ></Image>
                    <Text className="font-semibold text-lg">Thi thử</Text>
                  </View>
                </TouchableOpacity>
                <View className="flex flex-row justify-between items-center gap-2 px-3 w-[180px] h-24 bg-white rounded-2xl shadow shadow-slate-300 ">
                  <Image
                    source={require("../../../assets/images/home/search.png")}
                  ></Image>
                  <Text className="font-semibold text-lg">Tra từ</Text>
                </View>
              </View>
            </View>

            <View className="flex flex-col gap-3">
              <Text className="text-right text-3xl text-[#2B308B] font-bold ">
                Lịch sử
              </Text>
              <View className="flex flex-row justify-end gap-5">
                <Text className="px-7 py-2 bg-white rounded-3xl">Bài học</Text>
                <Text className="px-7 py-2 bg-white rounded-3xl ">Thi thử</Text>
              </View>
              <View className="bg-white rounded-3xl h-28">
                <Text className="text-center">Bỏ component vào đây</Text>
              </View>
            </View>
            <View className="flex flex-col gap-3">
              <Text className="text-3xl text-[#2B308B] font-bold ">Đã lưu</Text>
              <View className="flex flex-row justify-between">
                <View className="flex flex-col justify-center items-center w-[110px] h-[110px] bg-white rounded-3xl shadow shadow-slate-300 ">
                  <View className="w-[60px] h-[60px] justify-center items-center mt-4 bg-red-300 rounded-2xl">
                    <Text className="font-bold text-[#FFFFFF] text-4xl">
                      10
                    </Text>
                  </View>
                  <Text className="font-bold text-xl mt-3">Từ vựng</Text>
                </View>
                <View className="flex flex-col justify-center items-center w-[110px] h-[110px] bg-white rounded-3xl shadow shadow-slate-300 ">
                  <View className="w-[60px] h-[60px] justify-center items-center mt-4 bg-red-300 rounded-2xl">
                    <Text className="font-bold text-[#FFFFFF] text-4xl">
                      15
                    </Text>
                  </View>
                  <Text className="font-bold text-xl mt-3">Ngữ pháp</Text>
                </View>
                <View className="flex flex-col justify-center items-center w-[110px] h-[110px] bg-white rounded-3xl shadow shadow-slate-300 ">
                  <View className="w-[60px] h-[60px] justify-center items-center mt-4 bg-red-300 rounded-2xl">
                    <Text className="font-bold text-[#FFFFFF] text-4xl">
                      17
                    </Text>
                  </View>
                  <Text className="font-bold text-xl mt-3">Câu hỏi</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
