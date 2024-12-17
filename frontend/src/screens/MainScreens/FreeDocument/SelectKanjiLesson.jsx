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


const SelectKanjiLesson = ({navigation, route}) => {

  const { level } = route.params;
  let data = [];
  switch (level) {
    case 'N5':
      data = N5LessonData.kanji;
      break;
    case 'N4':
      data = N4LessonData.kanji;
      break;
    case 'N3':
      data = N3LessonData.kanji;
      break;
    case 'N2':
      data = N2LessonData.kanji;
      break;
    default:
      data = N1LessonData.kanji;
      break;
  }
  return (
   <SafeAreaView>
   <ScrollView>
    <View className="flex flex-col bg-slate-100 gap-7">
            <FreeDocumentComponent data={data} display="Vertical" />
    </View>
    
    </ScrollView>
    </SafeAreaView>
  );
};

export default SelectKanjiLesson;
