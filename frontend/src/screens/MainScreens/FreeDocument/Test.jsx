import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import axios from "axios";
import { LoadingContext } from '../../../context/LoadingContext';
import BASE_URL from "../../../api/config";

const Test = ({ route }) => {
  const { level } = route.params;
  const [allLessons, setAllLessons] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getAllLessons = async (level) => {
    let allLessons = [];
    let pageNumber = 1;

    while (true) {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/vocabulary/get-lesson?level=${level}&lessonNumber=${pageNumber}`
        );

        if (response.data.length === 0) {
          break;
        }

        const formattedLessons = {
          title: `Bài ${pageNumber}`,
          vocabulary: response.data || [],
        };

        allLessons.push(formattedLessons);
        pageNumber++;
      } catch (error) {
        console.error("Lỗi khi lấy khóa học:", error.response?.data?.message || error);
        break;
      } finally {
        setIsLoading(false);
      }
    }

    setAllLessons(allLessons);
  };

  const updateFilteredVocabulary = () => {
    const allVocabulary = [];
    selectedLessons.forEach((lessonTitle) => {
      const lesson = allLessons.find((lesson) => lesson.title === lessonTitle);
      if (lesson) {
        allVocabulary.push(...lesson.vocabulary);
      }
    });
    setFilteredVocabulary(allVocabulary);
  };

  useEffect(() => {
    getAllLessons(level);
  }, [level]);

  useEffect(() => {
    updateFilteredVocabulary();
  }, [selectedLessons, allLessons]);

  const toggleLesson = (lessonTitle) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonTitle) ? prev.filter((l) => l !== lessonTitle) : [...prev, lessonTitle]
    );
  };

  const handleNext = () => {
    if (currentIndex < filteredVocabulary.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false); 
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false); 
    }
  };

  return (
    <View className="flex-1 bg-gray-100 items-center p-4">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-4 w-3/4 max-h-[500px]"> 
            <Text className="text-lg font-bold mb-4">Chọn bài học</Text>
            <FlatList
              data={allLessons}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleLesson(item.title)}
                  className={`p-3 rounded-lg mb-2 w-full text-center ${selectedLessons.includes(item.title) ? "bg-blue-500" : "bg-gray-200"}`}
                >
                  <Text className={`${selectedLessons.includes(item.title) ? "text-white" : "text-gray-700"}`}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.title}
              style={{ maxHeight: 300 }} 
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-red-500 p-3 rounded-lg w-full"
            >
              <Text className="text-white text-center">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hiển thị tiến độ */}
      <View className="w-full mt-4 mb-4">
        <View className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <View
            style={{
              width: `${((currentIndex + 1) / filteredVocabulary.length) * 100}%`,
            }}
            className="bg-blue-500 h-2 rounded-full"
          />
        </View>
      </View>

      {/* Flashcard */}
      <View className="flex-1 justify-center items-center w-full">
        {filteredVocabulary.length > 0 ? (
          <TouchableOpacity
            onPress={() => setIsFlipped(!isFlipped)}
            className="bg-white flex-1 w-full h-[500px] rounded-lg shadow-md justify-center"
          >
            {isFlipped ? (
              <Text className="text-xl font-bold text-center">{filteredVocabulary[currentIndex].meaning}</Text>
            ) : (
              <View>
                <Text className="text-2xl font-bold text-center">{filteredVocabulary[currentIndex].kanji}</Text>
                <Text className="text-2xl  text-center">{filteredVocabulary[currentIndex].word}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <Text className="text-gray-500 text-lg">Không có từ vựng.</Text>
        )}
      </View>

      {/* Nút điều hướng */}
      <View className="flex-row justify-between w-full mt-4">
        <TouchableOpacity
          onPress={handlePrevious}
          className="bg-secondary p-3 rounded-lg"
          disabled={currentIndex === 0}
        >
          <Text className="text-white font-semibold">Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-gray-200 p-3 rounded-lg items-center flex-2"
        >
          <Text className=" text-lg">Chọn bài học</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary p-3 rounded-lg"
          disabled={currentIndex === filteredVocabulary.length - 1}
        >
          <Text className="text-white font-semibold">Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Test;
