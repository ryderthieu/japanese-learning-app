import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import axios from 'axios';
import { AuthContext } from "../../../context/AuthContext";
import { LoadingContext } from "../../../context/LoadingContext";
import Loading from "../../../components/Loading/Loading";
import BASE_URL from "../../../api/config";
import { ModalContext } from "../../../context/ModalContext";
const Login = ({navigation}) => {
  const {login} = useContext(AuthContext)
  const {openModal} = useContext(ModalContext)
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleLogin = async () => {
    console.log(email, password)
    await axios.post(`${BASE_URL}/user/login`, {
      email: email,
      password: password
    })
    .then ((res) => {
      const token = res.data.token
      openModal({type: 'success', message: 'Đăng nhập thành công!'})
      login(token)
    })
    .catch((error) => {
      console.log(error.response.data.message)
      openModal({type: 'error', message: error.response.data.message})
    }) 

  }

  return (

    <SafeAreaView>
      <View className="flex flex-col items-center w-screen h-screen px-5 py-16">
        <Image source={require("../../../assets/logo/logo-app.png")}></Image>
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
              paddingHorizontal: 10,
              borderBottomWidth: 0
            }}
            placeholder="Địa chỉ email"
            leftIcon={{ type: "ant-design", name: "user" }}
            onChangeText={setEmail}
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
            leftIcon={{ type: "feather", name: "key",  }}
            rightIcon={{ type: "feather", name: isPasswordVisible ? "eye-off" : "eye" , onPress: () => setPasswordVisible(!isPasswordVisible) }}
            onChangeText={setPassword}
          />
          <Text className="mb-5 text-right text-base text-[#2B308B]" onPress={() =>navigation.navigate('ForgotPassword')}>Quên mật khẩu?</Text>
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
            onPress={handleLogin}
          />
        </View>
        {/* <Text className="mt-10 mb-5 text-base">Hoặc đăng nhập bằng</Text>
        <View className="flex flex-row mb-5 ">
          <SocialIcon  onPress={() =>navigation.navigate('MainDrawer')} type="facebook" raise={false} />
          <SocialIcon  onPress={() =>navigation.navigate('Survey')} type="google" raise={false} />
          <SocialIcon onPress={() =>navigation.navigate('FreeDocument')} type="apple" light={true} raise={false} />
        </View> */}
        <View className="flex flex-row gap-2 text-base mt-3">
          <Text>Chưa có tài khoản?</Text>
          <Text className="text-[#2B308B] font-bold" onPress={() => navigation.navigate('Register')}>Đăng ký</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
