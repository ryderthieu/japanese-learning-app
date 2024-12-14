import {Text, View} from 'react-native'
import React from 'react'

const CircularProgress = ({ percentage }) => {
  return (
    <View className="flex items-center justify-center h-14 w-14">
      {/* Vòng tròn xám (background) */}
      <View className="absolute w-full h-full rounded-full border-[6px] border-gray-300" />

      {/* Vòng tròn đen thể hiện phần trăm */}
      <View
        className="absolute w-full h-full rounded-full border-[6px] border-black"
        style={{
          borderTopColor: "transparent", // Tạo hiệu ứng vòng tròn
          transform: [{ rotate: `${percentage * 3.6}deg` }],
        }}
      />

      {/* Text phần trăm */}
      <Text className="text-base font-bold text-black">{`${percentage}%`}</Text>
    </View>
  );
};
export default CircularProgress

