import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Swiper from 'react-native-swiper';

const vocabData = [
  {
    id: '1',
    word: '書く',
    pronunciation: 'かく',
    meaning: 'THƯ',
    type: 'Động từ nhóm I',
    example1: { jp: '書く時音楽を聞きます。', vi: 'Khi tôi vẽ, tôi nghe nhạc.' },
    example2: { jp: '私の愛について彼にわざわざ手紙を書く。', vi: 'Tôi cố tình viết thư cho anh ấy về tình cảm của tôi.' },
  },
  {
    id: '2',
    word: '読む',
    pronunciation: 'よむ',
    meaning: 'ĐỌC',
    type: 'Động từ nhóm I',
    example1: { jp: '新聞を読む。', vi: 'Tôi đọc báo.' },
    example2: { jp: '彼は毎日小説を読みます。', vi: 'Anh ấy đọc tiểu thuyết mỗi ngày.' },
  },
];

const Vocab = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Thanh tiến trình */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-lg font-bold">{`${currentIndex + 1}/${vocabData.length}`}</Text>
        <View className="w-full bg-gray-300 h-1 rounded-full">
          <View
            className="bg-blue-500 h-1 rounded-full"
            style={{ width: `${((currentIndex + 1) / vocabData.length) * 100}%` }}
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
      >
        {vocabData.map((card) => (
          <View key={card.id} className="flex-1 bg-white rounded-lg mx-4 p-6">
            <Text className="text-blue-600 text-4xl font-bold">{card.word}</Text>
            <Text className="text-gray-500 text-lg">{card.pronunciation}</Text>
            <Text className="text-gray-400 mb-2">{card.meaning}</Text>

            <View className="py-2">
              <Text className="text-green-600 font-semibold">{card.type}</Text>
            </View>

            <View className="mt-4">
              <Text className="text-yellow-600 text-lg">★ Vé</Text>
              <Text className="text-black mt-1">{card.example1.jp}</Text>
              <Text className="text-gray-500">{card.example1.vi}</Text>
            </View>

            <View className="mt-4">
              <Text className="text-yellow-600 text-lg">★ Viết</Text>
              <Text className="text-black mt-1">{card.example2.jp}</Text>
              <Text className="text-gray-500">{card.example2.vi}</Text>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Điều khiển chuyển trang */}
      <View className="flex-row justify-between px-4 py-2">
        <TouchableOpacity
          onPress={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          className="bg-blue-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentIndex((prev) => Math.min(prev + 1, vocabData.length - 1))}
          className="bg-pink-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Vocab;
