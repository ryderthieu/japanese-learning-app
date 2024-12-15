import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const SurveyOption = ({ icon, text, isSelected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`flex flex-row items-center gap-5 p-5 mb-7 border-2 rounded-3xl ${
          isSelected ? "bg-green-200 border-green-500" : "border-stone-400"
        }`}
      >
        <Image
          source={icon}
          className="object-contain shrink-0 w-10 aspect-square"
        />
        <Text className="text-xl font-bold text-gray-700">{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SurveyOption;
