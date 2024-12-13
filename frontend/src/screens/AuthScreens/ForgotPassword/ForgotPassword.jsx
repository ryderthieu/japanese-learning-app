import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";

const ForgotPassword = ({ navigation }) => {
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
        <Image source={require("../../../assets/images/forgotpass.png")}></Image>
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
        />
        <Button
          title={"Gửi mã OTP"}
          buttonStyle={{
            width: "100%",
            height: 50,
            backgroundColor: "#F490AF",
            borderRadius: 20,
          }}
          titleStyle={{
            fontWeight: "bold",
          }}
          onPress={() => navigation.navigate("SentOTP")}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
