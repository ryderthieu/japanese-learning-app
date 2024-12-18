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

const vocabData = [
  {
    id: 1,
    word: "書く",
    furigana: "かく [THƯ]",
    type: "Động từ nhóm I",
    stars: 1,
    img: require("./VC1.png"),
    examples: [
      {
        title: "Vẽ",
        sentence: "書く時音楽を聞きます。",
        translation: "Khi tôi vẽ, tôi nghe nhạc.",
      },
      {
        title: "Viết",
        sentence: "私の愛について彼にわざわざ手紙を書く。",
        translation: "Tôi cố tình viết thư cho anh ấy về tình cảm của tôi.",
      },
    ],
  },
  {
    id: 2,
    word: "読む",
    furigana: "よむ [ĐỘC]",
    type: "Động từ nhóm I",
    stars: 2,
    img: require("./VC1.png"),
    examples: [
      {
        title: "Đọc sách",
        sentence: "本を読むのが好きです。",
        translation: "Tôi thích đọc sách.",
      },
    ],
  },
  {
    id: 3,
    word: "見る",
    furigana: "みる [KIẾN]",
    type: "Động từ nhóm II",
    stars: 3,
    img: require("./VC1.png"),
    examples: [
      {
        title: "Nhìn",
        sentence: "星を見るのが好きです。",
        translation: "Tôi thích ngắm sao.",
      },
    ],
  },
  {
    id: 4,
    word: "飲む",
    furigana: "のむ [ẨM]",
    type: "Động từ nhóm I",
    stars: 2,
    img: require("./VC1.png"),
    examples: [
      {
        title: "Uống nước",
        sentence: "水を飲むのが必要です。",
        translation: "Cần uống nước.",
      },
    ],
  },
];

const Vocab = ({ navigation }) => {
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
          <Text className="text-xl text-center font-bold mb-2">{`${currentIndex + 1}/${vocabData.length}`}</Text>
          <View className="flex flex-row bg-gray-300 h-2 rounded-full">
            <View
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${((currentIndex + 1) / vocabData.length) * 100}%`,
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
          {vocabData.map((card) => (
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
                Math.min(prev + 1, vocabData.length - 1)
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
