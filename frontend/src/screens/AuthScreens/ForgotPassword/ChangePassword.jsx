import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import axios from "axios";
const ForgotPassword = ({ route, navigation }) => {
  const {email} = route.params
  console.log('param', route.params)
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('')
  const handleConfirm = async () => {
    console.log(email, newPassword)
    try {
      await axios.post('http://10.0.2.2:3000/api/user/reset-password', {newPassword: newPassword, email: email })
      alert('Đổi mật khẩu thành công, vui lòng đăng nhập lại')
      navigation.navigate('Login')
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <SafeAreaView>
      <View className="flex flex-col items-center gap-1 w-screen h-screen px-5 py-10">
        <TouchableOpacity
          className="absolute left-5 flex flex-row items-center"
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back-outline" type="ionicon" color="#00aced" />
          <Text className="text-base text-[#00aced]">Quay lại</Text>
        </TouchableOpacity>
        <Image source={require("../../../assets/images/changepass.png")}></Image>
        <Input
          containerStyle={{
            width: "full",
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
          placeholder="Mật khẩu mới"
          secureTextEntry={!isPasswordVisible}
          leftIcon={{ type: "feather", name: "key" }}
          rightIcon={{
            type: "feather",
            name: isPasswordVisible ? "eye-off" : "eye",
            onPress: () => setPasswordVisible(!isPasswordVisible),
          }}
          onChangeText={setNewPassword}
          value={newPassword}
        />
        <Input
          containerStyle={{
            width: "full",
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
          title={"Đổi mật khẩu"}
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

export default ForgotPassword;
