import React, { useState } from 'react';
import { View, Text, Image, Switch, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';

const Setting = ({ navigation }) => {
  const [isReminderExpanded, setIsReminderExpanded] = useState(false); // State để kiểm soát việc thu gọn

  return (
    <View className="flex-1 bg-slate-100 px-4 py-6 gap-5">
      {/* Header */}
      <View className="flex flex-row items-center h-[100px] bg-white rounded-3xl px-5">
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          className="w-20 h-20 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-bold">Trần Nhật Trường</Text>
          <Text className="text-gray-500">22251584@gm.uit.edu.vn</Text>
        </View>
        <TouchableOpacity
          className="ml-auto"
          onPress={() => navigation.navigate('EditAccount')}
        >
          <Icon name="edit" type="material" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Ngôn ngữ */}
      <View className="flex flex-row justify-between items-center h-[60px] bg-white rounded-3xl px-5">
        <Text className="text-base font-medium">Ngôn ngữ</Text>
        <Text className="text-blue-500">Tiếng Việt</Text>
      </View>

      {/* Nhắc nhở học tập */}
      <View className="flex flex-col bg-white rounded-3xl px-5 py-5">
        <TouchableOpacity
          onPress={() => setIsReminderExpanded(!isReminderExpanded)}
          className="flex flex-row justify-between items-center"
        >
          <Text className="text-base font-medium mb-2">Nhắc nhở học tập</Text>
          <Icon
            name={isReminderExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            type="ionicon"
            color={'#007AFF'}
          />
        </TouchableOpacity>
        {isReminderExpanded ? (
          <View className='mt-5'>
            {['07:30', '11:30', '17:30'].map((time, index) => (
              <View key={index} className="flex-row justify-between items-center mb-5">
                <Text className='text-xl'>{time}</Text>
                <Switch value={false} />
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* Dark Mode */}
      <View className="flex-row justify-between items-center px-5 bg-white rounded-3xl h-[60px]">
        <Text className="text-base font-medium">Chế độ tối</Text>
        <Switch value={false} />
      </View>

      {/* Logout Button */}
      <TouchableOpacity className="bg-red-500 rounded-lg py-3 mt-6 items-center">
        <Text className="text-white text-base font-bold">Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;
