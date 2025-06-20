import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import VocabIcon from '../../../../assets/VocabIcon.svg';
import KanjiIcon from '../../../../assets/KanjiIcon.svg';
import GrammarIcon from '../../../../assets/GrammarIcon.svg';
import TestIcon from '../../../../assets/TestIcon.svg';

const DocumentLevel = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState("N5"); // State quản lý trình độ

  // Dữ liệu trình độ
  const levels = ["N5", "N4", "N3", "N2", "N1"];
  const contentByLevel = {
    N5: { title: "Trình độ N5", image: require("../../../../assets//N5-banner.png") } ,
    N4: { title: "Trình độ N4", image: require("../../../../assets//N4-banner.png") },
    N3: { title: "Trình độ N3", image: require("../../../../assets//N3-banner.png") },
    N2: { title: "Trình độ N2", image: require("../../../../assets//N2-banner.png") },
    N1: { title: "Trình độ N1", image: require("../../../../assets//N1-banner.png") },
  };

  const renderContent = () => (
    <View className="flex flex-col gap-5">
      <Image source={contentByLevel[selectedLevel].image} className="w-full h-48 rounded-2xl mx-4" 
        style={{ marginHorizontal: 16 }} />
      <Text className="text-gray-800 font-bold text-xl px-4">{contentByLevel[selectedLevel].title}</Text>
      <View className="flex flex-col px-4 gap-4">
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            className="w-[48%] bg-white rounded-2xl p-5 items-center border border-gray-100"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
            onPress={() => navigation.navigate('SelectVocabLesson', { level: selectedLevel, topic: 'Vocab' })}
            activeOpacity={0.8}
          >
            <VocabIcon />
            <Text className="text-center text-base font-bold text-gray-700 mt-2">Từ Vựng</Text>
            <Text className="text-center text-xs text-gray-500 mt-1">Học từ vựng cơ bản</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[48%] bg-white rounded-2xl p-5 items-center border border-gray-100"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
            onPress={() => navigation.navigate('SelectKanjiLesson', { level: selectedLevel, topic: 'Kanji' })}
            activeOpacity={0.8}
          >
            <KanjiIcon />
            <Text className="text-center text-base font-bold text-gray-700 mt-2">Kanji</Text>
            <Text className="text-center text-xs text-gray-500 mt-1">Học chữ Hán</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between">
          <TouchableOpacity 
            className="w-[48%] bg-white rounded-2xl p-5 items-center border border-gray-100"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
            onPress={() => navigation.navigate('SelectGrammarLesson', { level: selectedLevel, topic: 'Grammar' })}
            activeOpacity={0.8}
          >
            <GrammarIcon />
            <Text className="text-center text-base font-bold text-gray-700 mt-2">Ngữ pháp</Text>
            <Text className="text-center text-xs text-gray-500 mt-1">Học cấu trúc câu</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-[48%] bg-white rounded-2xl p-5 items-center border border-gray-100"
            style={{
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
            onPress={() => navigation.navigate('Test', { level: selectedLevel, topic: 'Test' })}
            activeOpacity={0.8}
          >
            <TestIcon />
            <Text className="text-center text-base font-bold text-gray-700 mt-2">Ôn tập</Text>
            <Text className="text-center text-xs text-gray-500 mt-1">Kiểm tra kiến thức</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bộ lọc trình độ */}
        <View className="flex flex-row justify-around p-4 bg-white border-b border-gray-100">
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              className={`px-4 py-3 rounded-xl border ${
                selectedLevel === level 
                  ? "bg-pink-500 border-pink-400" 
                  : "bg-white border-gray-200"
              }`}
              style={{
                elevation: selectedLevel === level ? 1 : 0.5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: selectedLevel === level ? 0.1 : 0.03,
                shadowRadius: 2,
              }}
              onPress={() => setSelectedLevel(level)}
              activeOpacity={0.8}
            >
              <Text className={`text-center text-sm font-bold ${
                selectedLevel === level ? "text-white" : "text-gray-700"
              }`}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nội dung */}
        <View className="pt-4 pb-6">
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentLevel;
