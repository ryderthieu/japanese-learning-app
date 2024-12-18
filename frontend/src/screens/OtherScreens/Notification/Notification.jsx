import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Icon from "react-native-vector-icons/Ionicons";

const Notification = () => {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Ưu đãi đặc biệt",
      message: "Giảm 20% cho khóa học JLPT N3, đăng ký ngay hôm nay!",
      type: "promotion",
      read: false,
      date: "18/12/2024",
      icon: "https://img.icons8.com/?size=100&id=4Cmbf1lJOr60&format=png&color=000000",
    },
    {
      id: 2,
      title: "Cập nhật khóa học",
      message: "Khóa học JLPT N5 đã được thêm nội dung mới.",
      type: "update",
      read: false,
      date: "17/12/2024",
      icon: "https://img.icons8.com/color/48/synchronize--v1.png",
    },
    {
      id: 3,
      title: "Chào mừng bạn!",
      message: "Chúc mừng bạn đã tạo tài khoản thành công.",
      type: "welcome",
      read: true,
      date: "15/12/2024",
      icon: "https://img.icons8.com/?size=100&id=KILRNcSIA4Fn&format=png&color=000000",
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); 

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setNotifications((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title: "Thông báo mới",
          message: "Khóa học N4 đang có ưu đãi hấp dẫn!",
          type: "promotion",
          read: false,
          date: "18/12/2024",
          icon: "https://img.icons8.com/color/48/discount.png",
        },
      ]);
      setRefreshing(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNotificationPress = (notification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notification.id ? { ...notif, read: true } : notif
      )
    );
    navigation.navigate("NotificationDetails", { notification });
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={{
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 10,
      }}
      onPress={() => handleDelete(id)}
    >
      <Icon name="trash" size={28} color={"red"} />
    </TouchableOpacity>
  );

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread" && !notification.read) return true;
    return false;
  });

  return (
    <View className="flex-1 bg-gray-100 p-4">      
      <View className="flex flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={() => setFilter("all")}
          className={`${
            filter === "all" ? "bg-primary" : "bg-white"
          } p-2 rounded-lg`}
        >
          <Text className={`${filter === "all" && "text-white"}`}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("unread")}
          className={`${
            filter === "unread" ? "bg-primary text-white" : "bg-white"
          } p-2 rounded-lg`}
        >
          <Text className={`${filter === "unread" && "text-white"}`}>Chưa đọc</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.map((notification) => (
          <Swipeable
            key={notification.id}
            renderRightActions={() => renderRightActions(notification.id)}
          >
            <TouchableOpacity
              className={`flex flex-row items-center p-4 mb-3 rounded-lg shadow ${
                notification.read ? "bg-gray-200" : "bg-white"
              }`}
              onPress={() => handleNotificationPress(notification)}
            >
              <Image source={{ uri: notification.icon }} className="w-14 h-14 mr-4" />
              <View className="flex-1">
                <Text
                  className={`text-base font-semibold ${
                    notification.read ? "text-gray-600" : "text-black"
                  }`}
                >
                  {notification.title}
                </Text>
                <Text className="text-sm text-gray-600">
                  {notification.message.length > 50
                    ? `${notification.message.substring(0, 50)}...`
                    : notification.message}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {notification.date}
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notification;
