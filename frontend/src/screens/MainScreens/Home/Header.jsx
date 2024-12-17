import {Image, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/themed";
const Header = () => {
  return (
    <SafeAreaView className=" px-2 flex-row justify-between items-center bg-white">
        <Icon name="reorder-three-outline" type="ionicon" size={28} />
      <View className="flex flex-row gap-2 justify-center items-center">
        <Text className="text-xl font-semibold text-[#2B308B] ">こんにちは！</Text>
        <Image className="w-[50px] h-[50px] rounded-full" source={require('../../../assets/images/home/avatar.jpg')}></Image>
      </View>
    </SafeAreaView>
  );
};

export default Header;


