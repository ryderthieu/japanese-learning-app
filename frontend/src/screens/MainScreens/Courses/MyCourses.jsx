import React from "react";
import { View, Text, FlatList, Image } from "react-native";

const MyCourses = () => {
  const myCourses = [
    { id: 1, title: "Ngữ pháp N5 cơ bản", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Luyện nghe N4", image: "https://via.placeholder.com/150" },
  ];

  const renderMyCourse = ({ item }) => (
    <View className="flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4">
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md" />
      <Text className="ml-4 text-lg font-bold">{item.title}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Khóa Học Của Tôi</Text>
      <FlatList
        data={myCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMyCourse}
      />
    </View>
  );
};

export default MyCourses;