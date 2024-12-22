import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import LottieView from "lottie-react-native";
import axios from "axios";
import BASE_URL from "../../../api/config";

const SentOTP = ({ route, navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { email } = route.params;
  console.log(email);
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
    try {
      await axios.post(`${BASE_URL}/user/forgot-password`, {
        otp: otp.toString(),
        email: email,
      });
      alert("Nhập mã otp thành công, vui lòng nhập mật khẩu mới");
      navigation.navigate("ChangePassword", { email });
      console.log(email);
    } catch (error) {
      console.log(error.message);
    }
  };
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
        <View className="flex flex-row gap-3">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              className="w-[50px] h-[50px] border-1 border-gray-600 text-center justify-center items-center text-2xl font-bold rounded-xl bg-white"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              ref={(ref) => (inputs[index] = ref)}
            />
          ))}
        </View>
        <Button
          title={"Xác nhận"}
          buttonStyle={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "#F490AF",
            borderRadius: 20,
          }}
          titleStyle={{
            fontWeight: "bold",
          }}
          onPress={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
};

export default SentOTP;
