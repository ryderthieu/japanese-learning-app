import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const ChangePassword = () => {
  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <View className="space-y-6">
        {[
          { label: 'Mật khẩu cũ', placeholder: '**********' },
          { label: 'Mật khẩu mới', placeholder: 'yyyyyyyy' },
          { label: 'Nhập lại mật khẩu mới', placeholder: 'yyyyyyyy' },
        ].map((item, index) => (
          <View key={index}>
            <Text className="text-gray-500 mb-2">{item.label}</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
              secureTextEntry
              placeholder={item.placeholder}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity className="bg-blue-500 rounded-lg py-3 mt-6 items-center">
        <Text className="text-white text-base font-bold">Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
