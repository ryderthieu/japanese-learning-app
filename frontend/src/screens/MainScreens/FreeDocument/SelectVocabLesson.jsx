import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { LoadingContext } from "../../../context/LoadingContext";
import { useFreeDocument } from "../../../context/FreeDocumentContext";
import Loading from "../../../components/Loading/Loading";
import Icon from 'react-native-vector-icons/Ionicons';

const SelectVocabLesson = ({ navigation, route }) => {
  const { level } = route.params;
  const [allLessons, setAllLessons] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const { getVocabLessons, isPreloading } = useFreeDocument();

  useEffect(() => {
    // Lấy data từ context thay vì gọi API
    const lessons = getVocabLessons(level);
    setAllLessons(lessons);
  }, [level, getVocabLessons]);

  const handleLessonPress = (lesson) => {
    navigation.navigate("VocabularyLessonDetail", { lesson });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleLessonPress(item)}
      className="mb-4 p-5 bg-white rounded-2xl border border-gray-100"
      style={{
        marginHorizontal: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        {/* Lesson Number Circle */}
        <View className="w-14 h-14 bg-pink-500 rounded-2xl items-center justify-center mr-4">
          <Text className="text-white font-bold text-lg">{item.lessonNumber}</Text>
        </View>
        
        {/* Lesson Info */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">{item.title}</Text>
          <View className="flex-row items-center">
            <Icon name="book-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-500 ml-1">
              {item.wordsCount} từ vựng
            </Text>
          </View>
        </View>
        
        {/* Arrow Icon */}
        <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
          <Icon name="chevron-forward" size={16} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Hiển thị loading nếu đang preload
  if (isPreloading) return <Loading />

  return (
    <View className="flex-1 bg-gray-50">
      {allLessons.length > 0 ? (
        <FlatList
          data={allLessons}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Image source={require("../../../../assets/empty.png")} className="w-64 h-64 mb-4" />
          <Text className="text-gray-400 text-xl font-semibold text-center">Không có dữ liệu</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Chưa có bài học nào cho trình độ {level}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SelectVocabLesson;
