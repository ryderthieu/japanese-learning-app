import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Cart = ({ navigation }) => {
  // Dữ liệu mẫu giỏ hàng
  const cartItems = [
    { id: 1, title: "Ngữ pháp cơ bản N5", image: "https://via.placeholder.com/150", price: 200000 },
    { id: 2, title: "Kaiwa nâng cao", image: "https://via.placeholder.com/150", price: 500000 },
  ];

  // Tổng tiền
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Render từng sản phẩm trong giỏ hàng
  const renderCartItem = ({ item }) => (
    <View className="flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4">
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-gray-500">Giá: {item.price} VND</Text>
      </View>
      <TouchableOpacity onPress={() => alert(`Xóa ${item.title} khỏi giỏ hàng!`)}>
        <Ionicons name="trash-outline" size={28} color="#f43f5e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Danh sách sản phẩm */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Tổng tiền và thanh toán */}
      <View className="bg-white p-4 shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Tổng cộng:</Text>
          <Text className="text-xl font-bold text-green-500">{totalPrice} VND</Text>
        </View>
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg shadow-md"
          onPress={() => alert("Thanh toán thành công!")}
        >
          <Text className="text-center text-white text-lg font-bold">Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
