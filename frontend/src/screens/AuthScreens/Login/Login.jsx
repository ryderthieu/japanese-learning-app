import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button } from "@rneui/themed";
import { useAuth } from '../../../context/AuthContext';

const Login = ({navigation}) => {
  const { login } = useAuth();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng nhập');
    } finally {
      setLoading(false);
    }
  };

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
              onPress: () => setPasswordVisible(!isPasswordVisible)
            }}
            onChangeText={setPassword}
            value={password}
          />
          <Text 
            className="mb-5 text-right text-base text-[#2B308B]" 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Quên mật khẩu?
          </Text>
          <Button
            title={loading ? "Đang xử lý..." : "Đăng nhập"}
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
            disabled={loading}
          />
        </View>
        <View className="flex flex-row gap-2 text-base mt-3">
          <Text>Chưa có tài khoản?</Text>
          <Text 
            className="text-[#2B308B] font-bold" 
            onPress={() => navigation.navigate('Register')}
          >
            Đăng ký
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
