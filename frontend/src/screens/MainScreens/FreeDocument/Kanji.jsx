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

const kanjiData = [
    {
      id: 1,
      kanji: "書",
      onyomi: "ショ",
      kunyomi: "か",
      meaning: "「THƯ」",
      img: require("./VC1.png"),
      examples: [
        {
          word: "書",
          reading: "かく",
          meaning: "Viết",
        },
        {
          word: "図書館",
          reading: "としょかん",
          meaning: "Thư viện",
        },
        {
          word: "書道",
          reading: "しょどう",
          meaning: "Thư pháp",
        },
      ],
    },
    {
      id: 2,
      kanji: "読",
      onyomi: "ドク",
      kunyomi: "よ",
      meaning: "「ĐỘC」",
      img: require("./VC1.png"),
      examples: [
        {
          word: "読む",
          reading: "よむ",
          meaning: "Đọc",
        },
        {
          word: "読書",
          reading: "どくしょ",
          meaning: "Việc đọc sách",
        },
        {
          word: "音読",
          reading: "おんどく",
          meaning: "Đọc thành tiếng",
        },
      ],
    },
    {
      id: 3,
      kanji: "見",
      onyomi: "ケン",
      kunyomi: "み",
      meaning: "「KIẾN」",
      img: require("./VC1.png"),
      examples: [
        {
          word: "見る",
          reading: "みる",
          meaning: "Nhìn, xem",
        },
        {
          word: "見学",
          reading: "けんがく",
          meaning: "Tham quan học hỏi",
        },
        {
          word: "意見",
          reading: "いけん",
          meaning: "Ý kiến",
        },
      ],
    },
    {
      id: 4,
      kanji: "飲",
      onyomi: "イン",
      kunyomi: "の",
      meaning: "「ẨM」",
      img: require("./VC1.png"),
      examples: [
        {
          word: "飲む",
          reading: "のむ",
          meaning: "Uống",
        },
        {
          word: "飲食",
          reading: "いんしょく",
          meaning: "Ăn uống",
        },
        {
          word: "飲料水",
          reading: "いんりょうすい",
          meaning: "Nước uống",
        },
      ],
    },
  ];
  

const Kanji = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity
        className="left-5 flex flex-row items-center mb-5"
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back-outline" type="ionicon" color="#00aced" />
        <Text className="text-base text-[#00aced]">Quay lại</Text>
      </TouchableOpacity>
      <View className="flex-1 flex-col bg-gray-100">
        {/* Thanh tiến trình */}
        <View className="flex flex-col mb-10">
          <Text className="text-xl text-center font-bold mb-2">{`${currentIndex + 1}/${kanjiData.length}`}</Text>
          <View className="flex flex-row bg-gray-300 h-2 rounded-full">
            <View
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${((currentIndex + 1) / kanjiData.length) * 100}%`,
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
          {kanjiData.map((card) => (
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
                Math.min(prev + 1, kanjiData.length - 1)
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
