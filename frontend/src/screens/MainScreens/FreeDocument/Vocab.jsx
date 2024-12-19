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
import { Animated } from "react-native";
import N5VocabData from './data/N5VocabData'; 
import N4VocabData from './data/N4VocabData';
import N3VocabData from './data/N3VocabData';
import N2VocabData from './data/N2VocabData';
import N1VocabData from './data/N1VocabData';


const Vocab = ({ navigation, route }) => {
  
  const { LessonId } = route.params;
  const { level } = route.params;
  const { VocabId } = route.params;
  
  const [currentIndex, setCurrentIndex] = useState(VocabId - 1);
    

  console.log('Người dùng chọn bài ' + LessonId + ' và level ' + level)
    
  let data = [];
  switch (level) {
    case 'N5':
      data = N5VocabData[`lesson${LessonId}`];
      break;
    case 'N4':
      data = N4VocabData[`lesson${LessonId}`];
      break;
    case 'N3':
      data = N3VocabData[`lesson${LessonId}`];
      break;
    case 'N2':
      data = N2VocabData[`lesson${LessonId}`];
      break;
    default:
      data = N1VocabData[`lesson${LessonId}`];
      break; 
  }
  console.log(' Trình độ ' + level +' Từ vựng Bài ' +LessonId +  ' Vocab thứ ' + VocabId)
  
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
                    {card.word}
                  </Text>
                  <Text className="text-gray-500 text-xl">{card.furigana}</Text>
                  <Text className="text-white font-semibold bg-green-600 p-2 rounded-lg mt-2">
                    {card.type}
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
                    <Text className="text-xl">{example.title}</Text>
                  </View>
                  <Text className="text-black text-2xl mt-1 ml-5">
                    {example.sentence}
                  </Text>
                  <Text className="text-gray-500 text-base ml-5">
                    {example.translation}
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

export default Vocab
