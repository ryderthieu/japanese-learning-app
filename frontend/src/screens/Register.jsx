import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";

const Register = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView>
      <View className="flex flex-col items-center w-screen h-screen px-10 py-10">
        <Image source={require("../assets/logo/logo-app.png")}></Image>
        <Text className="mt-5 mb-10 text-4xl font-bold text-[#2B308B]">
          Đăng ký
        </Text>
        <View className="flex flex-col">
          <Input
            containerStyle={{
              width: 'full',
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              width: '100%',
              height: 60,
              backgroundColor: "white",
              borderBottomColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 10
            }}
            placeholder="Họ và tên"
            leftIcon={{ type: "ant-design", name: "user"}}
          />
          <Input
            containerStyle={{
              width: 'full',
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              width: '100%',
              height: 60,
              backgroundColor: "white",
              borderBottomColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 10
            }}
            placeholder="Địa chỉ email"
            leftIcon={{ type: "ant-design", name: "mail" }}
          />
          <Input
            containerStyle={{
              width: 'full',
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              width: '100%',
              height: 60,
              backgroundColor: "white",
              borderBottomColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 10
            }}
            placeholder="Mật khẩu"
            secureTextEntry={!isPasswordVisible}
            leftIcon={{ type: "feather", name: "key" }}
            rightIcon={{
              type: "feather",
              name: isPasswordVisible ? "eye-off" : "eye",
              onPress: () => setPasswordVisible(!isPasswordVisible),
            }}
          />
          <Input
            containerStyle={{
              width: 'full',
              paddingHorizontal: 0,
              marginBottom: 15,
            }}
            inputContainerStyle={{
              width: '100%',
              height: 60,
              backgroundColor: "white",
              borderBottomColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 10
            }}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={!isPasswordVisible}
            leftIcon={{ type: "feather", name: "key" }}
            rightIcon={{
              type: "feather",
              name: isPasswordVisible ? "eye-off" : "eye",
              onPress: () => setPasswordVisible(!isPasswordVisible),
            }}
          />
          <Button
            title={"Đăng ký"}
            buttonStyle={{
              width: 350,
              height: 50,
              backgroundColor: "#F490AF",
              borderRadius: 20,
            }}
            titleStyle={{
              fontWeight: "bold",
            }}
          />
        </View>
        <View className="flex flex-row gap-2 mt-10 text-base">
          <Text>Đã có tài khoản?</Text>
          <Text className="text-[#2B308B] font-bold" onPress={() => navigation.navigate('Login')}>Đăng nhập</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
