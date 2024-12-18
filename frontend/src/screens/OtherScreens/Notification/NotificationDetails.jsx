import React from "react";
import { View, Text, Image } from "react-native";

const NotificationDetailScreen = ({ route }) => {
  const { notification } = route.params;

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex items-center mb-4">
        <Image
          source={{ uri: notification.icon }}
          className="w-16 h-16 mb-4"
        />
        <Text className="text-lg font-bold mb-2">{notification.title}</Text>
      </View>
      <Text className="text-gray-700 text-base mb-4">{notification.message}</Text>
      <Text className="text-sm text-gray-500">
        Ngày thông báo: {notification.date}
      </Text>
      <Text className="text-sm text-gray-500 mt-2">
        Loại:{" "}
        {notification.type === "promotion"
          ? "Ưu đãi"
          : notification.type === "update"
          ? "Cập nhật"
          : "Chào mừng"}
      </Text>
    </View>
  );
};

export default NotificationDetailScreen;
