import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import CheckBox from 'react-native-check-box';
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../../context/AuthContext";
import { CartContext } from "../../../context/CartContext";

const Cart = ({ route, navigation }) => {
  const { token } = useContext(AuthContext)
  const { cartItems, setRefresh } = useContext(CartContext)
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("Lỗi khi tính tổng giỏ hàng:", error);
        Alert.alert("Lỗi", "Không thể tải giỏ hàng");
      }
    };

    fetchData();
  }, [selectedItems]);

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.some((selectedItem) => selectedItem._id === item._id)) {
        return prevSelectedItems.filter((selectedItem) => selectedItem._id !== item._id);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const handleRemoveItem = (item) => {
    Alert.alert("Xóa", `Xóa ${item.title} khỏi giỏ hàng!`, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        onPress: () => {
          removeFromCart([item._id])
        },
      },
    ]);
  };

  const removeFromCart = async (courses) => {
    try {
      await axios.post("http://192.168.1.47:3000/api/user/remove-from-cart", { courses: courses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setRefresh(prev => !prev)
    } catch (error) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
    }
  }

  const handlePayment = async () => {
    const courses = selectedItems.map(v => v._id)
    if (courses.length === 0){
      alert('Bạn chưa chọn')
      return
    }
    console.log(courses)
    try {
      await axios.post("http://192.168.1.47:3000/api/user/add-courses", { courses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      removeFromCart(courses)
      alert('Thanh toán thành công')
    } catch (error) {
      alert('Lỗi: Bạn đã có khóa học')
    } 
  }
  const renderCartItem = ({ item }) => (
    <View className="flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4 gap-4">
      <CheckBox
        isChecked={selectedItems.some((selectedItem) => selectedItem._id === item._id)}
        onClick={() => handleSelectItem(item)}
        checkBoxColor="#0D308C"
      />

      <Image source={{ uri: item.thumbnail }} className="w-16 h-16 rounded-md" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-gray-500">Giá: {item.price} VND</Text>
      </View>

      <TouchableOpacity onPress={() => handleRemoveItem(item)}>
        <Ionicons name="trash-outline" size={28} color="#f43f5e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <View className="bg-white p-4 shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Tổng cộng:</Text>
          <Text className="text-xl font-bold text-primary">{totalPrice} VND</Text>
        </View>
        <TouchableOpacity
          className="bg-primary p-4 rounded-lg shadow-md"
          onPress={() => handlePayment()}
        >
          <Text className="text-center text-white text-lg font-bold">Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
