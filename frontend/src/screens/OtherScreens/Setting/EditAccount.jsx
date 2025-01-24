import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Icon } from '@rneui/themed';

const ExampleData = [
    { label: 'Tên', value: 'Huynh Van Thieu' },
    { label: 'Tên đăng nhập', value: 'tnt171' },
    { label: 'Email', value: 'ryderthieu666@gmail.com' },
    { label: 'Sinh nhật', value: '17/10/2004' },
]

const EditAccount = ({navigation}) => {
  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Profile Picture */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: 'https://via.placeholder.com/192' }}
          className="w-48 h-48 rounded-full mb-3"
        />
        <View className="flex-row gap-5">
          <TouchableOpacity className='flex flex-row justify-center items-center gap-3'>
            <Icon name='images-outline' type='ionicon' color={'#007AFF'} />
            <Text className="text-blue-500 font-semibold">Chọn ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity className='flex flex-row justify-center items-center gap-3'>
            <Icon name='cut-outline' type='ionicon' color={'#007AFF'} />
            <Text className="text-blue-500 font-semibold">Cắt ảnh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Details */}
      {ExampleData.map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-500 mb-2">{item.label}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            value={item.value}
            editable={false}
          />
        </View>
      ))}

      {/* Change Password Button */}
      <TouchableOpacity className="bg-blue-500 rounded-lg py-3 items-center" onPress={() => navigation.navigate('ChangePassword')}>
        <Text className="text-white text-base font-bold">Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>

  );
};

export default EditAccount;
