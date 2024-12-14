import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Courses = ({ navigation }) => {
  const [cartCount, setCartCount] = useState(0); // Số lượng sản phẩm trong giỏ hàng

  // Dữ liệu mẫu
  const newCourses = [
    { id: 1, title: "Ngữ pháp cơ bản N5", image: "https://via.placeholder.com/150", price: 200000 },
    { id: 2, title: "Luyện nghe N4 nâng cao", image: "https://via.placeholder.com/150", price: 250000 },
  ];

  const jlptCourses = [
    { id: 3, title: "Kanji N3", image: "https://via.placeholder.com/150", price: 300000 },
    { id: 4, title: "Ngữ pháp N2", image: "https://via.placeholder.com/150", price: 350000 },
  ];

  const kaiwaCourses = [
    { id: 5, title: "Kaiwa cơ bản", image: "https://via.placeholder.com/150", price: 400000 },
    { id: 6, title: "Kaiwa nâng cao", image: "https://via.placeholder.com/150", price: 500000 },
  ];

  const specialCourses = [
    { id: 7, title: "Tiếng Nhật kinh doanh", image: "https://via.placeholder.com/150", price: 600000 },
    { id: 8, title: "Tiếng Nhật IT", image: "https://via.placeholder.com/150", price: 700000 },
  ];

  // Xử lý thêm vào giỏ hàng
  const addToCart = (course) => {
    setCartCount(cartCount + 1); // Tăng số lượng giỏ hàng
    alert(`Thêm ${course.title} vào giỏ hàng!`);
  };

  // Render danh sách khóa học
  const renderCourse = ({ item }) => (
    <TouchableOpacity className="flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4" onPress={() => navigation.navigate("CourseDetail", { course: item })}>
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-gray-500">Giá: {item.price} VND</Text>
      </View>
      <TouchableOpacity onPress={() => addToCart(item)}>
        <Ionicons name="cart-outline" size={32} color="#22c55e" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-white shadow-md">
        <Text className="text-2xl font-bold">Khóa Học</Text>
        <TouchableOpacity onPress={() => navigation.navigate("MyCourses")}>
          <Ionicons name="school-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Danh sách các danh mục khóa học */}
      <ScrollView className="p-4">
        {/* Khóa học mới */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Khóa học mới</Text>
          <FlatList
            data={newCourses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourse}
            horizontal
          />
        </View>

        {/* Khóa học theo JLPT */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Khóa học theo JLPT</Text>
          <FlatList
            data={jlptCourses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourse}
            horizontal
          />
        </View>

        {/* Khóa học Kaiwa */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Khóa học Kaiwa</Text>
          <FlatList
            data={kaiwaCourses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourse}
            horizontal
          />
        </View>

        {/* Khóa học chuyên ngành */}
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Khóa học chuyên ngành</Text>
          <FlatList
            data={specialCourses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCourse}
            horizontal
          />
        </View>
      </ScrollView>

      {/* Nút nổi bật với badge giỏ hàng */}
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-green-500 p-4 rounded-full shadow-lg"
        onPress={() => navigation.navigate("Cart")}
      >
        <View>
          <Ionicons name="cart-outline" size={28} color="#fff" />
          {cartCount > 0 && (
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 justify-center items-center">
              <Text className="text-white text-xs font-bold">{cartCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Courses;
