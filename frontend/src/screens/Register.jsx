import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "@rneui/themed";
const Register = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/bg-dang-ky.png")}
        resizeMode="cover"
        style={styles.background}
        blurRadius={1}
      >
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.description}>
              Nhập các thông tin phía dưới để đăng ký miễn phí
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formInput}>
              <Input
                rightIcon={{ type: "ionicon", name: "mail-outline" }}
                placeholder="example@gmail.com"
                label="Email"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                inputStyle={styles.inputText}
              />
              <Input
                rightIcon={{ type: "ionicon", name: "person-circle-outline" }}
                placeholder="Nguyễn Văn A"
                label="Họ và tên"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                inputStyle={styles.inputText}
              />
              <Input
                rightIcon={{ type: "ionicon", name: "eye-outline" }}
                placeholder="Mật khẩu"
                label="Mật khẩu"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                inputStyle={styles.inputText}
                secureTextEntry={true}
              />
              <Input
                rightIcon={{ type: "ionicon", name: "eye-outline" }}
                placeholder="Xác nhận mật khẩu"
                label="Xác nhận mật khẩu"
                containerStyle={styles.inputContainer}
                inputContainerStyle={styles.input}
                inputStyle={styles.inputText}
                secureTextEntry={true}
              />
            </View>
            <Button
              title={"Tạo tài khoản"}
              containerStyle={{
                width: "80%",
                marginVertical: 30,
              }}
              buttonStyle={{
                padding: 10,
                backgroundColor: "#2B308B",
                borderRadius: 10,
              }}
            />
            <View style={styles.login}>
              <Text style={styles.text}>Bạn đã có tài khoản?</Text>
              <Text
                style={[styles.text, styles.link]}
                onPress={() => navigation.navigate("Login")}
              >
                Đăng nhập
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  formContainer: {
    width: "100%",
    height: "80%",
  },
  header: {
    margin: 20,
  },
  title: {
    color: "#2B308B",
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    color: "#2B308B",
    fontSize: 14,
  },
  form: {
    backgroundColor: "#fff",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  formInput: {
    alignItems: "center",
  },
  inputContainer: {
    paddingHorizontal: 0,
    width: "80%",
    marginTop: 10,
    height: 80,
  },
  input: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    paddingRight: 5,
  },
  inputText: {
    padding: 10,
    fontSize: 16,
  },
  login: {
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    marginRight: 10,
  },
  link: {
    color: "#2B308B",
    fontWeight: "bold",
  },
});
