import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import FreeDocumentComponent from "./FreeDocumentComponent";
import coursesData from "./coursesData";
import { SafeAreaView } from "react-native-safe-area-context";
import N1LessonData from "./data/N1LessonData";
import N2LessonData from "./data/N2LessonData";
import N3LessonData from "./data/N3LessonData";
import N4LessonData from "./data/N4LessonData";
import N5LessonData from "./data/N5LessonData";

const SelectVocabLesson = ({ navigation, route }) => {
  const { level } = route.params;
  const { topic } = route.params;

  console.log("Người dùng chọn level " + level + " và topic " + topic);

  let data = [];
  switch (level) {
    case "N5":
      data = N5LessonData.vocab;
      break;
    case "N4":
      data = N4LessonData.vocab;
      break;
    case "N3":
      data = N3LessonData.vocab;
      break;
    case "N2":
      data = N2LessonData.vocab;
      break;
    default:
      data = N1LessonData.vocab;
      break;
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingVertical: 20}}>
      <FreeDocumentComponent data={data} level={level} topic={topic} />
    </ScrollView>
  );
};

export default SelectVocabLesson;
