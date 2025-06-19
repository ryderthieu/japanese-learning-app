import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Button from "../../../components/Button/Button";
import { CartContext } from "../../../context/CartContext";
import { ModalContext } from "../../../context/ModalContext";
import userService from "../../../api/userService";

const CourseDetail = ({ route, navigation }) => {
  const { item } = route.params;
  const { setRefresh } = useContext(CartContext)
  const {openModal} = useContext(ModalContext)

  const addToCart = async (course) => {
    try {
      await userService.addToCart({ courseId: course._id });
      setRefresh(prev => !prev)
      openModal({type: 'success', message: 'Thêm khóa học vào giỏ hàng thành công!'})
    } catch (error) {
      openModal({type: 'error', message: error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng'})
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Image source={{ uri: item.thumbnail }} className="w-full h-full rounded-lg mb-4" resizeMode="contain" />
        <Text className="text-2xl font-bold mb-2">{item.title}</Text>
        <Text className="text-gray-500 text-lg mb-4">Giá: {item.price} VND</Text>
        <Text className="text-lg text-gray-700 mb-4">
          {item.description}
        </Text>

        <TouchableOpacity onPress={() => addToCart(item)}>
          <Button title='Thêm vào giỏ hàng' />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default CourseDetail;
