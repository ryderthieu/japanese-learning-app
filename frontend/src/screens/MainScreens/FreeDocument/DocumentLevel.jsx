import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import VocabIcon from './VocabIcon.svg';
import KanjiIcon from './KanjiIcon.svg';
import GrammarIcon from './GrammarIcon.svg';
import TestIcon from './TestIcon.svg';

const DocumentLevel = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState("N5"); // State quản lý trình độ

  // Dữ liệu trình độ
  const levels = ["N5", "N4", "N3", "N2", "N1"];
  const contentByLevel = {
    N5: { title: "Trình độ N5", image: require("./N5-banner.png") } ,
    N4: { title: "Trình độ N4", image: require("./N4-banner.png") },
    N3: { title: "Trình độ N3", image: require("./N3-banner.png") },
    N2: { title: "Trình độ N2", image: require("./N2-banner.png") },
    N1: { title: "Trình độ N1", image: require("./N1-banner.png") },
  };

  const renderContent = () => (
    <View className="flex flex-col gap-5">
      <Image source={contentByLevel[selectedLevel].image} className="w-full h-48" />
      <Text className="text-black font-bold text-xl">{contentByLevel[selectedLevel].title}</Text>
      <View className="flex flex-col px-4 gap-5">
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            className="w-[48%] bg-white rounded-lg p-4 items-center shadow-sm"
            onPress={() => navigation.navigate('SelectVocabLesson', { level: selectedLevel, topic: 'Vocab' })}
          >
            <VocabIcon />
            <Text className="text-center text-lg font-semibold">Từ Vựng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[48%] bg-white rounded-lg p-4 items-center shadow-sm"
            onPress={() => navigation.navigate('SelectKanjiLesson', { level: selectedLevel, topic: 'Kanji' })}
          >
            <KanjiIcon />
            <Text className="text-center text-lg font-semibold">Kanji</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between">
          <TouchableOpacity className="w-[48%] bg-white rounded-lg p-4 items-center shadow-sm"
           onPress={() => navigation.navigate('SelectGrammarLesson', { level: selectedLevel, topic: 'Grammar' })}
          >
            <GrammarIcon />
            <Text className="text-center text-lg font-semibold">Ngữ pháp</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-[48%] bg-white rounded-lg p-4 items-center shadow-sm">
            <TestIcon />
            <Text className="text-center text-lg font-semibold">Ôn tập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView>
        {/* Bộ lọc trình độ */}
        <View className="flex flex-row justify-around p-4 bg-white shadow-sm">
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              className={`px-5 py-2 rounded-full ${selectedLevel === level ? "bg-blue-500" : "bg-gray-300"}`}
              onPress={() => setSelectedLevel(level)}
            >
              <Text className={`text-center text-sm font-semibold ${selectedLevel === level ? "text-white" : "text-black"}`}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nội dung */}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentLevel;
