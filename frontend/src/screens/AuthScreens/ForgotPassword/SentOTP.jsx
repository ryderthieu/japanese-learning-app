import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import LottieView from "lottie-react-native";
import { ModalContext } from "../../../context/ModalContext";
import userService from "../../../api/userService";

const SentOTP = ({ route, navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { email } = route.params;
  const {openModal} = useContext(ModalContext)
  
  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 5) {
        const nextInput = inputs[index + 1];
        nextInput?.focus();
      } else {
        Keyboard.dismiss();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index > 0) {
        const prevInput = inputs[index - 1];
        prevInput?.focus();
      }
    }
  };
  
  const inputs = [];
  
  const handleConfirm = async () => {
    // Kiểm tra OTP có đủ 6 số không
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      openModal({type: 'error', message: 'Vui lòng nhập đủ 6 số OTP'});
      return;
    }
    
    setIsLoading(true);
    try {
      await userService.confirmOtp({
        otp: otpString,
        email: email,
      });
      openModal({type: 'success', message: "Xác nhận OTP thành công, vui lòng nhập mật khẩu mới"});
      navigation.navigate("ChangePassword", { email });
    } catch (error) {
      openModal({type: 'error', message: error.response?.data?.message || 'Mã OTP không đúng'});
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kiểm tra OTP có đủ 6 số không
  const isOtpComplete = otp.join('').length === 6;
  
  return (
    <SafeAreaView>
      <View className="flex flex-col items-center gap-5 w-screen h-screen px-5">
        <LottieView
          source={require("../../../assets/animate/SendOTP.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300, alignSelf: "center" }}
          speed={2}
        />
        
        <Text className="text-lg font-semibold text-gray-700 mb-2">
          Nhập mã OTP đã gửi đến {email}
        </Text>
        
        <View className="flex flex-row gap-3">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              className="w-[50px] h-[50px] border-2 border-gray-300 text-center justify-center items-center text-2xl font-bold rounded-xl bg-white"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              ref={(ref) => (inputs[index] = ref)}
            />
          ))}
        </View>
        
        <Button
          title={isLoading ? "Đang xác nhận..." : "Xác nhận"}
          buttonStyle={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: isOtpComplete ? "#F490AF" : "#ccc",
            borderRadius: 20,
          }}
          titleStyle={{
            fontWeight: "bold",
          }}
          onPress={handleConfirm}
          disabled={!isOtpComplete || isLoading}
        />
        
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-4"
        >
          <Text className="text-pink-500 font-semibold">
            Gửi lại mã OTP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SentOTP;
