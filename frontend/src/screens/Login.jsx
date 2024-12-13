import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";

const Login = ({navigation}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (

    <SafeAreaView>
      <View className="flex flex-col items-center w-screen h-screen px-10 py-16">
        <Image source={require("../assets/logo/logo-app.png")}></Image>
        <Text className="mt-10 mb-10 text-4xl font-bold text-[#2B308B]">
          Đăng nhập
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
            placeholder="Địa chỉ email"
            leftIcon={{ type: "ant-design", name: "user" }}
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
            leftIcon={{ type: "feather", name: "key",  }}
            rightIcon={{ type: "feather", name: isPasswordVisible ? "eye-off" : "eye" , onPress: () => setPasswordVisible(!isPasswordVisible) }}
          />
          <Text className="mb-5 text-right text-base text-[#2B308B]">
            Quên mật khẩu?
          </Text>
          <Button
            title={"Đăng nhập"}
            buttonStyle={{
              width: 350,
              height: 50,
              backgroundColor: "#F490AF",
              borderRadius: 20,
            }}
            titleStyle={{
             fontWeight: 'bold'
            }}
          />
        </View>
        <Text className="mt-10 mb-5 text-base">Hoặc đăng nhập bằng</Text>
        <View className="flex flex-row mb-5 ">
          <SocialIcon type="facebook" raise={false} />
          <SocialIcon type="google" raise={false} />
          <SocialIcon type="apple" light={true} raise={false} />
        </View>
        <View className="flex flex-row gap-2 text-base">
          <Text>Chưa có tài khoản?</Text>
          <Text className="text-[#2B308B] font-bold" onPress={() => navigation.navigate('Register')}>Đăng ký</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
