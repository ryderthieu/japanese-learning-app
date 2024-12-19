import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import N5KanjiData from "./data/N5KanjiData";
import N4KanjiData from "./data/N4KanjiData";
import N3KanjiData from "./data/N3KanjiData";
import N2KanjiData from "./data/N2KanjiData";
import N1KanjiData from "./data/N1KanjiData";

import { Icon } from "@rneui/themed";

const KanjiList = ({navigation, route}) => {

    const { LessonId } = route.params;
    const { level } = route.params;

    console.log('Người dùng chọn bài ' + LessonId + ' và level ' + level)
    
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

    if (data && data.length === 0) {
        console.log('Dữ liệu trống');
      }


  return (
    <View className="flex-1 bg-slate-100 p-4">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        style={{ overflow: "visible" }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Kanji', { level: level ,LessonId: LessonId, KanjiId: item.id })}>
            <View className="relative flex-row gap-3 items-center justify-between p-3 mb-3 bg-white rounded-2xl border border-gray-200">
              {/* Thanh màu hồng */}
              <View className="absolute w-2 h-11 bg-pink-400 rounded-full -left-[3px]" />

              {/* Nội dung từ vựng */}
              <View className="ml-3 flex-1">
                <Text className="text-2xl font-semibold text-gray-700">
                  {item.kanji}
                </Text>
                <Text className="text-sm text-gray-500">
                  {`(${item.onyomi} / ${item.kunyomi})`}
                </Text>
              </View>

              {/* Ý nghĩa từ */}
              <Text className="text-lg font-medium text-green-600">
                {item.meaning}
              </Text>

              {/* Nút yêu thích */}
              <TouchableOpacity>
                <Icon name="heart-outline" type="ionicon" color={"#BCBCBC"} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="h-[100%] flex-col justify-center gap-2 items-center">
            <Image
              source={require("./empty.png")}
              style={{ width: 250, height: 250 }}
            />
            <Text className="text-gray-400 text-xl ">Không có dữ liệu</Text>
          </View>
        }
      />
    </View>
  );
};

export default KanjiList
