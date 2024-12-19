import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Swiper from "react-native-swiper";
import { Icon } from "@rneui/themed";
import N5KanjiData from "./data/N5KanjiData";
import N4KanjiData from "./data/N4KanjiData";
import N3KanjiData from "./data/N3KanjiData";
import N2KanjiData from "./data/N2KanjiData";
import N1KanjiData from "./data/N1KanjiData";

  
const Kanji = ({ navigation, route }) => {
  const { LessonId } = route.params;
  const { level } = route.params;
  const { KanjiId } = route.params;
  console.log('Mã kanji' + KanjiId)
    
  const [currentIndex, setCurrentIndex] = useState(KanjiId - 1);
    
  let data = [];
  switch (level) {
    case 'N5':
      data = N5KanjiData[`lesson${LessonId}`];
      break;
    case 'N4':
      data = N4KanjiData[`lesson${LessonId}`];
      break;
    case 'N3':
      data = N3KanjiData[`lesson${LessonId}`];
      break;
    case 'N2':
      data = N2KanjiData[`lesson${LessonId}`];
      break;
    default:
      data = N1KanjiData[`lesson${LessonId}`];
      break; 
  }
  console.log(' Trình độ ' + level +' Kanji bài ' +LessonId +  ' Kanji thứ ' + KanjiId)

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex-col bg-gray-100">
        {/* Thanh tiến trình */}
        <View className="flex flex-col mb-10">
          <Text className="text-xl text-center font-bold mb-2">{`${currentIndex + 1}/${data.length}`}</Text>
          <View className="flex flex-row bg-gray-300 h-2 rounded-full">
            <View
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${((currentIndex + 1) / data.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Thẻ từ vựng */}
        <Swiper
          index={currentIndex}
          onIndexChanged={(index) => setCurrentIndex(index)}
          loop={false}
          showsPagination={false}
          showsButtons={false}
          bounces={true}
        >
          {data.map((card) => (
            <View
              key={card.id}
              className="flex h-[500px] w-auto bg-white rounded-3xl shadow-md mx-4 p-6"
            >
              <View className="flex flex-row justify-between">
                <View>
                  <Text className="text-[#2B308B] text-6xl font-bold">
                    {card.kanji}
                  </Text>
                  <Text className="text-gray-500 text-xl">Âm On: {card.onyomi}</Text>
                  <Text className="text-gray-500 text-xl">Âm Kun: {card.kunyomi}</Text>
                  <Text className="text-white text-center min-w-[60px] text-xl font-semibold bg-green-600 p-2 rounded-lg mt-2">
                    {card.meaning}
                  </Text>
                </View>
                <Image source={card.img}></Image>
              </View>

              {card.examples.map((example, index) => (
                <View key={index} className="mt-4">
                  <View className="flex flex-row gap-2 items-center -ml-5">
                    <Icon
                      name="star"
                      type="ionicon"
                      size={24}
                      color={"#F6B425"}
                    />
                    <Text className="text-2xl">{example.word}</Text>
                  </View>
                  <Text className="text-black text-xl mt-1 ml-5">
                    {example.reading}
                  </Text>
                  <Text className="text-gray-500 text-base ml-5">
                    {example.meaning}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Swiper>

        {/* Điều khiển chuyển trang */}
        <View className="flex-row justify-between px-6 py-2">
          <TouchableOpacity
            onPress={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            className="bg-[#2B308B] w-[160px] px-5 py-5 rounded-2xl"
          >
            <Text className="text-white text-xl text-center font-semibold">
              Quay lại
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setCurrentIndex((prev) =>
                Math.min(prev + 1, data.length - 1)
              )
            }
            className="bg-[#F490AF] w-[160px] px-5 py-5 rounded-2xl"
          >
            <Text className="text-white text-xl text-center font-semibold">
              Tiếp theo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Kanji
