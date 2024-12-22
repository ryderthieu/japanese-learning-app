import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import LottieView from "lottie-react-native";
import axios from "axios";
import BASE_URL from "../../../api/config";
import { ModalContext } from "../../../context/ModalContext";
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/forgot-password`, {
        email,
      });

      alert("Mã otp đã gửi đến email của bạn");
      navigation.navigate("SentOTP", { email });
    } catch (error) {
      console.log(error.message);
      alert(error.response?.data?.error || "Đã xảy ra lỗi!");
    }
  };
  return (
    <SafeAreaView>
      <View className="flex flex-col items-center w-screen h-screen px-5">
        <LottieView
          source={require("../../../assets/animate/ForgotPassword.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300, alignSelf: "center" }}
          speed={3}
        />

        <Input
          containerStyle={{
            width: "100%",
            paddingHorizontal: 0,
          }}
          inputContainerStyle={{
            width: "100%",
            height: 60,
            backgroundColor: "white",
            borderBottomColor: "white",
            borderRadius: 20,
            paddingHorizontal: 10,
            borderBottomWidth: 0,
          }}
          placeholder="Địa chỉ email đã đăng ký"
          leftIcon={{ type: "ant-design", name: "mail" }}
          onChangeText={setEmail}
          value={email}
        />
        <Button
          title={"Gửi mã OTP"}
          buttonStyle={{
            padding: 10,
            paddingHorizontal: 20,
            backgroundColor: "#F490AF",
            borderRadius: 20,
          }}
          titleStyle={{
            fontWeight: "bold",
            textAlign: "center",
          }}
          onPress={handleSendOtp}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
