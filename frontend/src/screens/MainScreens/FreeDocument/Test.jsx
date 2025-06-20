import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Animated, Dimensions, ImageBackground } from "react-native";
import { LoadingContext } from '../../../context/LoadingContext';
import vocabularyService from "../../../api/vocabularyService";
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from "../../../components/Loading/Loading";

const { width, height } = Dimensions.get('window');

const Test = ({ route }) => {
  const { level } = route.params;
  const [allLessons, setAllLessons] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Animation values
  const flipAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(1);

  const getAllLessons = async (level) => {
    let allLessons = [];
    let pageNumber = 1;

    while (true) {
      try {
        setIsLoading(true);
        const response = await vocabularyService.getLessons({ level, lessonNumber: pageNumber });

        if (!response || response.length === 0) {
          break;
        }

        const formattedLessons = {
          title: `Bài ${pageNumber}`,
          vocabulary: response || [],
          lessonNumber: pageNumber,
        };

        allLessons.push(formattedLessons);
        pageNumber++;
      } catch (error) {
        console.error("Lỗi khi lấy bài học:", error.response?.data?.message || error);
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
    setCurrentIndex(0);
    setIsFlipped(false);
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

  const animateFlip = () => {
    Animated.sequence([
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    setIsFlipped(!isFlipped);
  };

  const animateCardPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleNext = () => {
    if (currentIndex < filteredVocabulary.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const rotateInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  if (isLoading) return <Loading />;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Progress Bar đơn giản */}
      {filteredVocabulary.length > 0 && (
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <View
              style={{
                width: `${((currentIndex + 1) / filteredVocabulary.length) * 100}%`,
              }}
              className="bg-pink-500 h-full rounded-full"
            />
          </View>
          <Text className="text-center text-sm text-gray-500 mt-2">
            {currentIndex + 1} / {filteredVocabulary.length}
          </Text>
        </View>
      )}

      {/* Flashcard Container */}
      <View className="flex-1 justify-center items-center px-6 py-8">
        {filteredVocabulary.length > 0 ? (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnimation }],
              width: width - 48,
              height: height * 0.5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                animateCardPress();
                animateFlip();
              }}
              activeOpacity={0.9}
              className="flex-1"
            >
              <Animated.View
                style={{
                  transform: [{ rotateY: rotateInterpolate }],
                }}
                className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100"
              >
                <ImageBackground
                  source={{
                    uri: 'https://images.unsplash.com/photo-1515169974629-fc2a2c225eeb?w=500&h=300&fit=crop&crop=center'
                  }}
                  className="flex-1 rounded-3xl overflow-hidden"
                  imageStyle={{ opacity: 0.05 }}
                >
                  <View className="flex-1 justify-center items-center p-8">
                    {isFlipped ? (
                      // Mặt sau - Ý nghĩa
                      <View className="items-center">
                        <Icon name="language-outline" size={48} color="#F472B6" style={{ marginBottom: 20 }} />
                        <Text className="text-2xl font-bold text-gray-800 text-center leading-10">
                          {filteredVocabulary[currentIndex]?.meaning || 'Không có ý nghĩa'}
                        </Text>
                      </View>
                    ) : (
                      // Mặt trước - Từ vựng
                      <View className="items-center">
                        <Icon name="book-outline" size={48} color="#3B82F6" style={{ marginBottom: 20 }} />
                        {filteredVocabulary[currentIndex]?.kanji && (
                          <Text className="text-5xl font-bold text-blue-700 mb-4 text-center">
                            {filteredVocabulary[currentIndex].kanji}
                          </Text>
                        )}
                        <Text className="text-3xl font-semibold text-gray-800 text-center mb-2">
                          {filteredVocabulary[currentIndex]?.word || 'Không có từ'}
                        </Text>
                        {filteredVocabulary[currentIndex]?.romanji && (
                          <Text className="text-lg text-gray-500 italic text-center">
                            {filteredVocabulary[currentIndex].romanji}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </ImageBackground>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          // Empty State
          <View className="items-center py-20">
            <View className="bg-gray-100 p-6 rounded-full mb-6">
              <Icon name="library-outline" size={64} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 text-xl font-semibold text-center mb-3">
              Chưa có từ vựng
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-6 px-8">
              Hãy chọn ít nhất một bài học để bắt đầu ôn tập flashcard
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-pink-500 px-6 py-3 rounded-2xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Chọn bài học</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      {filteredVocabulary.length > 0 && (
        <View className="flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex-row items-center px-6 py-3 rounded-2xl ${
              currentIndex === 0 ? 'bg-gray-100' : 'bg-blue-500'
            }`}
            activeOpacity={0.8}
          >
            <Icon 
              name="chevron-back" 
              size={20} 
              color={currentIndex === 0 ? '#9CA3AF' : 'white'} 
              style={{ marginRight: 8 }}
            />
            <Text className={`font-semibold ${
              currentIndex === 0 ? 'text-gray-400' : 'text-white'
            }`}>
              Trước
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-gray-100 px-4 py-3 rounded-2xl flex-row items-center"
            activeOpacity={0.8}
          >
            <Icon name="list-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <Text className="text-gray-600 font-medium">Bài học</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex === filteredVocabulary.length - 1}
            className={`flex-row items-center px-6 py-3 rounded-2xl ${
              currentIndex === filteredVocabulary.length - 1 ? 'bg-gray-100' : 'bg-blue-500'
            }`}
            activeOpacity={0.8}
          >
            <Text className={`font-semibold ${
              currentIndex === filteredVocabulary.length - 1 ? 'text-gray-400' : 'text-white'
            }`}>
              Sau
            </Text>
            <Icon 
              name="chevron-forward" 
              size={20} 
              color={currentIndex === filteredVocabulary.length - 1 ? '#9CA3AF' : 'white'} 
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal chọn bài học */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
              <Text className="text-xl font-bold text-gray-800">Chọn bài học</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-100 p-2 rounded-full"
                activeOpacity={0.8}
              >
                <Icon name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={allLessons}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleLesson(item.title)}
                  className={`p-4 rounded-2xl mb-3 border-2 ${
                    selectedLessons.includes(item.title) 
                      ? "bg-pink-50 border-pink-500" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className={`w-10 h-10 rounded-2xl items-center justify-center mr-4 ${
                        selectedLessons.includes(item.title) ? "bg-pink-500" : "bg-gray-300"
                      }`}>
                        <Text className={`font-bold ${
                          selectedLessons.includes(item.title) ? "text-white" : "text-gray-600"
                        }`}>
                          {item.lessonNumber}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className={`text-lg font-semibold ${
                          selectedLessons.includes(item.title) ? "text-pink-700" : "text-gray-700"
                        }`}>
                          {item.title}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {item.vocabulary.length} từ vựng
                        </Text>
                      </View>
                    </View>
                    {selectedLessons.includes(item.title) && (
                      <Icon name="checkmark-circle" size={24} color="#F472B6" />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.title}
            />
            
            <View className="p-4 border-t border-gray-100">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-pink-500 p-4 rounded-2xl"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Hoàn thành ({selectedLessons.length} bài đã chọn)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Test;
