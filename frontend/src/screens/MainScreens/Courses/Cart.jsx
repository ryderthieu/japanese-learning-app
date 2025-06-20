import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import CheckBox from 'react-native-check-box';
import Ionicons from "react-native-vector-icons/Ionicons";
import { CartContext } from "../../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { ModalContext } from "../../../context/ModalContext";
import userService from "../../../api/userService";
import paymentService from "../../../api/paymentService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({ route }) => {
  const navigation = useNavigation()
  const { cartItems, setRefresh } = useContext(CartContext)
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { openModal } = useContext(ModalContext)

  useEffect(() => {
    const fetchData = () => {
      try {
        const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("Lỗi khi tính tổng giỏ hàng:", error);
        openModal({type: 'error', message: "Không thể tải giỏ hàng"});
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

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      // Bỏ chọn tất cả
      setSelectedItems([]);
    } else {
      // Chọn tất cả
      setSelectedItems([...cartItems]);
    }
  };

  const handleRemoveItem = (item) => {
    openModal({type: 'confirm', message: `Xóa ${item.title} khỏi giỏ hàng!`, onConfirm: () => removeFromCart([item._id])})
  };

  const removeFromCart = async (courses) => {
    try {
      await userService.removeFromCart({ courses });
      setRefresh(prev => !prev)
      // Cập nhật selectedItems sau khi xóa
      setSelectedItems(prev => prev.filter(item => !courses.includes(item._id)));
      openModal({type: 'success', message: 'Xóa thành công!'})
    } catch (error) {
      openModal({type: 'error', message: error.response?.data?.message || 'Lỗi khi xóa khỏi giỏ hàng'})
    }
  }

  const handlePayment = async () => {
    if (selectedItems.length === 0) {
      openModal({message: 'Bạn chưa chọn khóa học để thanh toán!'})
      return
    }

    try {
      setLoading(true);
      
      // Check authentication token
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        openModal({
          type: 'error', 
          message: 'Bạn cần đăng nhập để thực hiện thanh toán. Vui lòng đăng nhập lại.',
          onConfirm: () => navigation.navigate('Login')
        });
        return;
      }
      
      const paymentData = {
        items: selectedItems.map(course => ({
          courseId: course._id,
          quantity: 1
        })),
        returnUrl: 'japaneselearningapp://payment/success',
        cancelUrl: 'japaneselearningapp://payment/cancel'
      };

      const response = await paymentService.createPayment(paymentData);
      
      if (response.success) {
        // Navigate to PayOS payment process screen
        navigation.navigate('PaymentProcess', {
          orderData: response.data,
          selectedCourses: selectedItems,
          fromCart: true
        });
      } else {
        openModal({type: 'error', message: response.message || 'Không thể tạo thanh toán'});
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle authentication errors
      if (error.status === 401) {
        openModal({
          type: 'error', 
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          onConfirm: () => {
            // Remove token and navigate to login
            AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          }
        });
      } else {
        openModal({type: 'error', message: error.message || 'Có lỗi xảy ra khi tạo thanh toán'});
      }
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const renderCartItem = ({ item }) => (
    <View className="flex-row items-center bg-white shadow-lg rounded-lg p-4 mb-4 gap-4">
      <CheckBox
        isChecked={selectedItems.some((selectedItem) => selectedItem._id === item._id)}
        onClick={() => handleSelectItem(item)}
        checkBoxColor="#0D308C"
      />

      <Image source={{ uri: item.thumbnail }} className="w-16 h-16 rounded-md" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold" numberOfLines={2}>{item.title}</Text>
        <Text className="text-gray-500">Giá: {formatCurrency(item.price)}</Text>
      </View>

      <TouchableOpacity onPress={() => handleRemoveItem(item)}>
        <Ionicons name="trash-outline" size={28} color="#f43f5e" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {cartItems.length > 0 ? (
        <>
          {/* Header với nút chọn tất cả */}
          <View className="bg-white p-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={handleSelectAll}
              >
                <CheckBox
                  isChecked={selectedItems.length === cartItems.length && cartItems.length > 0}
                  onClick={handleSelectAll}
                  checkBoxColor="#0D308C"
                />
                <Text className="ml-2 text-lg font-semibold">
                  Chọn tất cả ({cartItems.length})
                </Text>
              </TouchableOpacity>
              
              <Text className="text-gray-500">
                Đã chọn: {selectedItems.length}
              </Text>
            </View>
          </View>

          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View className="flex-col items-center bg-white shadow-lg rounded-lg p-4 mb-4 gap-4 flex-1 justify-center">
          <LottieView
            source={require('../../../assets/animate/nodata.json')}
            autoPlay
            loop
            style={{ width: 300, height: 300, alignSelf: 'center' }}
            speed={3}
          />
          <Text className="text-lg text-gray-500 text-center mt-4">
            Giỏ hàng của bạn đang trống
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg mt-4"
            onPress={() => navigation.navigate('Courses')}
          >
            <Text className="text-white font-semibold">Khám phá khóa học</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom payment section */}
      {cartItems.length > 0 && (
        <View className="bg-white p-4 shadow-lg border-t border-gray-200">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold">
                Tổng cộng ({selectedItems.length} khóa học):
              </Text>
              <Text className="text-sm text-gray-500">
                Đã bao gồm VAT (nếu có)
              </Text>
            </View>
            <Text className="text-xl font-bold text-primary">
              {formatCurrency(totalPrice)}
            </Text>
          </View>
          
          <TouchableOpacity
            className={`p-4 rounded-lg shadow-md ${
              selectedItems.length === 0 || loading 
                ? 'bg-gray-300' 
                : 'bg-primary'
            }`}
            onPress={handlePayment}
            disabled={selectedItems.length === 0 || loading}
          >
            <View className="flex-row items-center justify-center">
              {loading ? (
                <>
                  <Ionicons name="hourglass-outline" size={20} color="#fff" />
                  <Text className="text-center text-white text-lg font-bold ml-2">
                    Đang xử lý...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color="#fff" />
                  <Text className="text-center text-white text-lg font-bold ml-2">
                    Thanh toán với PayOS
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          
          {selectedItems.length === 0 && (
            <Text className="text-center text-gray-500 text-sm mt-2">
              Vui lòng chọn khóa học để thanh toán
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Cart;
