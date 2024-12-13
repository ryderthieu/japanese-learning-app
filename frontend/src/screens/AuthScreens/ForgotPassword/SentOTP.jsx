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

const SentOTP = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

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

  return (
    <SafeAreaView>
      <View className="flex flex-col items-center gap-5 w-screen h-screen px-5 py-10">
        <TouchableOpacity
          className="absolute left-5 flex flex-row items-center"
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back-outline" type="ionicon" color="#00aced" />
          <Text className="text-base text-[#00aced]">Quay lại</Text>
        </TouchableOpacity>
        <Image source={require("../../../assets/images/sentemail.png")}></Image>
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
            width: "100%",
            height: 50,
            backgroundColor: "#F490AF",
            borderRadius: 20,
          }}
          titleStyle={{
            fontWeight: "bold",
          }}
          onPress={() => navigation.navigate("ChangePassword")}
        />
      </View>
    </SafeAreaView>
  );
};

export default SentOTP;
