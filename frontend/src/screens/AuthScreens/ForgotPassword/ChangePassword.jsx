import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Icon, Button, SocialIcon } from "@rneui/themed";
import { useState } from "react";
import LottieView from "lottie-react-native";
import { ModalContext } from "../../../context/ModalContext";
import userService from "../../../api/userService";

const ChangePassword = ({ route, navigation }) => {
  const { email } = route.params;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {openModal} = useContext(ModalContext)
  
  const handleConfirm = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      openModal({type: 'error', message: 'Vui lòng nhập đầy đủ thông tin'});
      return;
    }
    
    if (newPassword.length < 6) {
      openModal({type: 'error', message: 'Mật khẩu phải có ít nhất 6 ký tự'});
      return;
    }
    
    if (newPassword !== confirmPassword) {
      openModal({type: 'error', message: 'Mật khẩu xác nhận không khớp'});
      return;
    }
    
    setIsLoading(true);
    try {
      await userService.resetPassword({
        newPassword: newPassword,
        email: email,
      });
      openModal({type: 'success', message: "Đổi mật khẩu thành công, vui lòng đăng nhập lại"});
      navigation.navigate("Login");
    } catch (error) {
      openModal({type: 'error', message: error.response?.data?.message || 'Đổi mật khẩu thất bại'});
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;
  
  return (
    <SafeAreaView>
      <View className="flex flex-col items-center gap-1 w-screen h-screen px-5">
        <LottieView
          source={require("../../../assets/animate/ChangePassword.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300, alignSelf: "center" }}
          speed={1}
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
          secureTextEntry={!isConfirmPasswordVisible}
          leftIcon={{ type: "feather", name: "key" }}
          rightIcon={{
            type: "feather",
            name: isConfirmPasswordVisible ? "eye-off" : "eye",
            onPress: () => setConfirmPasswordVisible(!isConfirmPasswordVisible),
          }}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <Button
          title={isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
          buttonStyle={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: isFormValid ? "#F472B6" : "#ccc",
            borderRadius: 20,
          }}
          titleStyle={{
            fontWeight: "bold",
          }}
          onPress={handleConfirm}
          disabled={!isFormValid || isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
