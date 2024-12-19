import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "../../../components/Button/Button";

const CourseDetail = ({ route, navigation }) => {
  const { item } = route.params;
  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Image source={{ uri: item.thumbnail }} className="w-full h-full rounded-lg mb-4" resizeMode="contain" />
        <Text className="text-2xl font-bold mb-2">{item.title}</Text>
        <Text className="text-gray-500 text-lg mb-4">Giá: {item.price} VND</Text>
        <Text className="text-lg text-gray-700 mb-4">
          {item.description}
        </Text>
        
        <Button title = 'Thêm vào giỏ hàng'/>

      </ScrollView>
    </View>
  );
};

export default CourseDetail;
