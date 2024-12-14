import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const CourseDetail = ({ route, navigation }) => {
  // Nhận dữ liệu từ route
  const { course } = route.params;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold">{course.title}</Text>
        <TouchableOpacity onPress={() => alert("Đã chia sẻ khóa học!")}>
          <Ionicons name="share-social-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Nội dung chi tiết */}
      <ScrollView className="p-4">
        <Image source={{ uri: course.image }} className="w-full h-48 rounded-lg mb-4" />
        <Text className="text-2xl font-bold mb-2">{course.title}</Text>
        <Text className="text-gray-500 text-lg mb-4">Giá: {course.price} VND</Text>
        <Text className="text-lg text-gray-700 mb-4">
          Đây là khóa học được thiết kế dành riêng cho những ai muốn nâng cao kỹ năng tiếng Nhật.
          Nội dung bao gồm bài học chi tiết, bài tập thực hành và hỗ trợ 24/7 từ giảng viên.
        </Text>
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg shadow-md"
          onPress={() => alert("Khóa học đã được thêm vào giỏ hàng!")}
        >
          <Text className="text-center text-white text-lg font-bold">Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CourseDetail;
