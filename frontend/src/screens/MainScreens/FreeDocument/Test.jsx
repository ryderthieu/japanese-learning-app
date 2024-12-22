import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const Test = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <LottieView
        source={require("../../../assets/animate/develope.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300, alignSelf: "center" }}
        speed={2}
      />
      <Text>Tính năng đang được phát triển</Text>
    </View>
  );
};

export default Test;
