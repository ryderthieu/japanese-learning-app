import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import BASE_URL from "../../../api/config";
import { LoadingContext } from "../../../context/LoadingContext";
import Loading from "../../../components/Loading/Loading";

const SelectVocabLesson = ({ navigation, route }) => {
  const { level } = route.params;
  const [allLessons, setAllLessons] = useState([]);
  const {isLoading, setIsLoading} = useContext(LoadingContext)
  const getAllLessons = async (level) => {
    let allLessons = [];
    let pageNumber = 1;

    while (true) {
      try {
        setIsLoading(true)
        const response = await axios.get(`${BASE_URL}/vocabulary/get-lesson?level=${level}&lessonNumber=${pageNumber}`);

        if (response.data.length === 0) {
          break; 
        }

        const formattedLessons = {
          title: `Bài ${pageNumber}`,
          image: 'https://newwindows.edu.vn/wp-content/uploads/2023/09/5-3-1024x1024.png', 
          grammars: response.data || [],
        };

        allLessons.push(formattedLessons);
        pageNumber++;
      } catch (error) {
        console.error("Lỗi khi lấy khóa học:", error.response?.data?.message || error);
        break;
      } finally {
        setIsLoading(false)

      }
    }

    setAllLessons(allLessons);
  };

  useEffect(() => {
    getAllLessons(level);
  }, [level]);

  const handleLessonPress = (lesson) => {
    navigation.navigate("VocabularyLessonDetail", { lesson });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleLessonPress(item)}
      className="mb-4 p-4 bg-white rounded-xl shadow-md"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 20,
        elevation: 5,  // Tạo bóng cho card
      }}
    >
      {/* Card bên trái: Hình ảnh */}
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-lg"
        style={{ marginRight: 15 }}
      />
      
      {/* Card bên phải: Tiêu đề bài học */}
      <View className="flex-1">
        <Text className="text-xl font-semibold">{item.title}</Text>
        <Text className="text-gray-500 mt-2">Nhấp vào để xem chi tiết</Text>
      </View>
      
      {/* Thêm icon hoặc bất kỳ thành phần nào nếu cần */}
    </TouchableOpacity>
  );

  if (isLoading) return <Loading />

  return (
    <View className="px-4 py-6">
      {allLessons.length > 0 ? (
        <FlatList
          data={allLessons}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center gap-4">
          <Image source={require("./empty.png")} className="w-64 h-64" />
          <Text className="text-gray-400 text-xl">Không có dữ liệu</Text>
        </View>
      )}
    </View>
  );
};

export default SelectVocabLesson;
