import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import { ModalContext } from "../../../context/ModalContext";
import userService from "../../../api/userService";

const Register = ({ navigation }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const {openModal} = useContext(ModalContext)

  const handleSignup = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      openModal({type: 'error', message: 'Vui lòng điền đầy đủ thông tin'});
      return;
    }

    if (password !== confirmPassword) {
      openModal({type: 'error', message: 'Mật khẩu xác nhận không khớp'});
      return;
    }

    if (password.length < 6) {
      openModal({type: 'error', message: 'Mật khẩu phải có ít nhất 6 ký tự'});
      return;
    }

    try {
      await userService.signup(email, password, fullName);
      openModal({type: 'success', message: 'Đăng ký thành công!'})
      navigation.navigate('Login')
    } catch (error) {
      console.log(error.response?.data?.error)
      openModal({type: 'error', message: error.response?.data?.error || 'Đăng ký thất bại'})
    }
  }

  return (
    <SafeAreaView>
      <View className="flex flex-col items-center w-screen h-screen px-10 py-10">
        <Image source={require("../../../assets/logo/logo-app.png")}></Image>
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
              paddingHorizontal: 10,
              borderBottomWidth: 0
            }}
            placeholder="Họ và tên"
            leftIcon={{ type: "ant-design", name: "user"}}
            onChangeText={setFullName}
            value={fullName}
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
              paddingHorizontal: 10,
              borderBottomWidth: 0
            }}
            placeholder="Địa chỉ email"
            leftIcon={{ type: "ant-design", name: "mail" }}
            onChangeText={setEmail}
            value={email}
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
              paddingHorizontal: 10,
              borderBottomWidth: 0
            }}
            placeholder="Mật khẩu"
            secureTextEntry={!isPasswordVisible}
            leftIcon={{ type: "feather", name: "key" }}
            rightIcon={{
              type: "feather",
              name: isPasswordVisible ? "eye-off" : "eye",
              onPress: () => setPasswordVisible(!isPasswordVisible),
            }}
            onChangeText={setPassword}
            value={password}
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
              paddingHorizontal: 10,
              borderBottomWidth: 0
            }}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={!isPasswordVisible}
            leftIcon={{ type: "feather", name: "key" }}
            rightIcon={{
              type: "feather",
              name: isPasswordVisible ? "eye-off" : "eye",
              onPress: () => setPasswordVisible(!isPasswordVisible),
            }}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <Button
            onPress={handleSignup}
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
