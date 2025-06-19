import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import LottieView from "lottie-react-native";

const Overlay = ({ isVisible, onClose, type, message, title, onConfirm }) => {
  const modalStyles = {
    success: {
      title: 'Thành công',
      animation: require("../../assets/animate/sucess.json"),
      textColor: "text-white",
    },
    error: {
      title: 'Lỗi',
      animation: require("../../assets/animate/error.json"),
      textColor: "text-white",
    },
    warning: {
      title: 'Cảnh báo',
      animation: require("../../assets/animate/warining.json"),
      textColor: "text-black",
    },
    info: {
      title: 'Thông báo',
      animation: require("../../assets/animate/info.json"),
      textColor: "text-white",
    },
    confirm: {
      title: 'Xác nhận ?',
      animation: require("../../assets/animate/info.json"),
      textColor: "text-white",
    },
  };

  const currentStyle = modalStyles[type] || modalStyles.info;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="w-4/5 bg-white rounded-lg p-6 shadow-lg items-center">

              <Text className="text-xl font-bold text-center mb-4 text-gray-800">
                {title ? title : currentStyle.title}
              </Text>

              <LottieView
                source={currentStyle.animation}
                autoPlay
                loop
                style={{ width: 80, height: 80, marginBottom: 10 }}
              />

              <Text className="text-center text-gray-700 mb-6">{message}</Text>

              {type === "confirm" || type === "warning" ? (
                <View className="flex-row gap-5">
                  <TouchableOpacity
                    className="bg-gray-200 w-[80px] h-[40px] items-center justify-center rounded-lg"
                    onPress={onClose}
                  >
                    <Text className=" font-bold text-center">Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-primary w-[80px] h-[40px] items-center justify-center rounded-lg"
                    onPress={() => {
                      if (typeof onConfirm === 'function') {
                        onConfirm();
                      }
                      onClose(); 
                    }}
                  >
                    <Text className="text-white font-bold text-center">Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-primary w-[80px] h-[40px] items-center justify-center rounded-lg"
                  onPress={() => {
                    if (typeof onConfirm === 'function') {
                      onConfirm();
                    }
                    onClose();
                  }}
                >
                  <Text className="text-white font-bold text-center">Xác nhận</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Overlay;
