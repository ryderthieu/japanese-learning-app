import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../../../context/AuthContext';
const ExampleData = [
  { label: 'Tên', value: 'Huỳnh Văn Thiệu' },
  { label: 'Email', value: '22521396@gmail.com' },
  { label: 'Sinh nhật', value: '17/10/2004' },
]

const Setting = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(ExampleData);
  const [showButtons, setShowButtons] = useState(true); 
  const {logout} = useContext(AuthContext)
  const handleEditPress = () => {
    setIsEditing(true); 
    setShowButtons(false); 
  };

  const handleSavePress = () => {
    setIsEditing(false); 
    setShowButtons(true); 
  };

  const handleCancelPress = () => {
    setIsEditing(false); 
    setShowButtons(true); 
  };

  const handleChangeText = (text, index) => {
    const newData = [...userData];
    if (userData[index].label !== 'Email') {
      newData[index].value = text; 
      setUserData(newData);
    }
  };

  const handleLogout = () => {
    logout()
    console.log('Đăng xuất');
    navigation.navigate('MainStack'); 
  };

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-6">
      <View className="items-center mb-6">
        <Image
          source={{ uri: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-nu-cute-55.jpg' }}
          className="w-48 h-48 rounded-full mb-3"
        />
      </View>

      {!isEditing && (
        <TouchableOpacity
          className="flex-row justify-between items-center"
          onPress={handleEditPress}
        >
          <Icon name='create-outline' size={28} className='absolute right-0'/>

        </TouchableOpacity>
      )}
      {userData.map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="text-gray-500 mb-2 text-lg">{item.label}</Text>

          {isEditing && item.label !== 'Email' ? (
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white text-lg"
              value={item.value}
              onChangeText={(text) => handleChangeText(text, index)} 
            />
          ) : item.label === 'Email' && isEditing ? (
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-gray-200 text-lg"
              value={item.value}
              editable={false} 
              selectTextOnFocus={false} 
            />
          ) : (
            <Text className="text-gray-700 text-lg">{item.value}</Text>
          )}
        </View>
      ))}



      {isEditing && (
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-green-500 rounded-lg py-3 items-center mb-4 shadow-md flex-1 mr-2"
            onPress={handleSavePress} 
          >
            <Text className="text-white text-lg font-bold">Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 rounded-lg py-3 items-center mb-4 shadow-md flex-1 ml-2"
            onPress={handleCancelPress} 
          >
            <Text className="text-white text-lg font-bold">Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      {showButtons && (
        <TouchableOpacity
          className="bg-green-500 rounded-lg py-3 items-center mb-4 shadow-md"
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text className="text-white text-lg font-bold">Đổi mật khẩu</Text>
        </TouchableOpacity>
      )}

      {showButtons && (
        <TouchableOpacity
          className="bg-red-500 rounded-lg py-3 items-center shadow-md"
          onPress={handleLogout}
        >
          <Text className="text-white text-lg font-bold">Đăng xuất</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Setting;
