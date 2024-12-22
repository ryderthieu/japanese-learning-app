import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import FreeDocumentComponent from "./FreeDocumentComponent";
import { GrammarCard } from "../../../components/Card/Card";
import coursesData from "./coursesData";
import { SafeAreaView } from "react-native-safe-area-context";
import N1LessonData from "./data/N1LessonData";
import N2LessonData from "./data/N2LessonData";
import N3LessonData from "./data/N3LessonData";
import N4LessonData from "./data/N4LessonData";
import N5LessonData from "./data/N5LessonData";

const SelectGrammarLesson = ({ navigation, route }) => {
  const { level } = route.params;
  const { topic } = route.params;

  console.log("Người dùng chọn level " + level + " và topic " + topic);

  let data = [];
  switch (level) {
    case "N5":
      data = N5LessonData.grammar;
      break;
    case "N4":
      data = N4LessonData.grammar;
      break;
    case "N3":
      data = N3LessonData.grammar;
      break;
    case "N2":
      data = N2LessonData.grammar;
      break;
    default:
      data = N1LessonData.grammar;
      break;
  }
  console.log(data.length);
  return (
      <View className="px-3">
        {data.length ? (
          <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          <View className="px-3">
            {data.map((grammarItem, index) => (
              <GrammarCard item={grammarItem} key={index} />
            ))}
          </View>
        </ScrollView>
        ) : (
          <View className="h-[100%] justify-center items-center gap-2">
            <Image
              source={require("./empty.png")}
              style={{ width: 250, height: 250 }}
            />
            <Text className="text-gray-400 text-xl ">Không có dữ liệu</Text>
          </View>
        )}
      </View>
  );
};

export default SelectGrammarLesson;
