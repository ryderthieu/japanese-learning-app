import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../context/AuthContext';
import { ModalContext } from '../../../context/ModalContext';
import { LoadingContext, LoadingSpinner } from '../../../context/LoadingContext';
import userService from '../../../api/userService';

const InfoField = ({ label, value, editable, onChangeText, type = 'text', options = [], edit }) => (
  <View className="mb-4">
    <Text className="font-semibold mb-2 text-gray-600">{label}</Text>
    <View className={`bg-white rounded-2xl shadow-sm border ${edit && editable ? 'border-pink-200' : 'border-gray-100'}`}>
      {type === 'options' && edit ? (
        <View className="flex-row justify-center p-3">
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className={`flex-row items-center px-8 py-3 mx-2 rounded-xl ${value === opt.value 
                ? 'bg-pink-500' 
                : 'bg-pink-50'}`}
              onPress={() => onChangeText(opt.value)}
            >
              <Icon 
                name={opt.icon} 
                size={20} 
                color={value === opt.value ? 'white' : '#EC4899'}
                style={{ marginRight: 6 }}
              />
              <Text className={`${value === opt.value ? 'text-white' : 'text-pink-500'} font-medium text-base`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : edit && editable ? (
        <View className="flex-row items-center p-3">
          <TextInput
            className="flex-1 text-gray-700 text-base"
            value={value}
            onChangeText={onChangeText}
            placeholder={`Nhập ${label.toLowerCase()}`}
            placeholderTextColor="#9CA3AF"
          />
          {value && (
            <TouchableOpacity 
              className="p-1" 
              onPress={() => onChangeText('')}
            >
              <Icon name="close-circle" size={20} color="#EC4899" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View className="p-3">
          <Text className="text-gray-700 text-base">
            {type === 'options' 
              ? options.find(opt => opt.value === value)?.label || 'Chưa chọn'
              : value || 'Chưa cập nhật'}
          </Text>
        </View>
      )}
    </View>
  </View>
);

const AccountInfoScreen = () => {
  const { userInfo, updateUserInfo } = useAuth();
  const { openModal } = useContext(ModalContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    gender: 'male',
    dateOfBirth: '',
  });

  const genderOptions = [
    { value: 'male', label: 'Nam', icon: 'male' },
    { value: 'female', label: 'Nữ', icon: 'female' },
  ];

  useEffect(() => {
    if (userInfo) {
      setForm({
        email: userInfo.email,
        fullName: userInfo.fullName || '',
        gender: userInfo.gender || 'male',
        dateOfBirth: userInfo.dateOfBirth ? formatDateForInput(userInfo.dateOfBirth) : '',
      });
    }
  }, [userInfo]);

  // Hàm format ngày từ ISO string về YYYY-MM-DD cho input
  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    // Sử dụng UTC để tránh lỗi múi giờ
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Hàm format ngày từ YYYY-MM-DD về ISO string
  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    // Tạo date object với UTC để tránh lỗi múi giờ
    const [year, month, day] = dateString.split('-');
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    return date.toISOString();
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Format ngày sinh trước khi gửi
      const formattedData = {
        ...form,
        dateOfBirth: formatDateForAPI(form.dateOfBirth)
      };
      await updateUserInfo(formattedData);
      setEdit(false);
      openModal({type: 'success', message: 'Đã cập nhật thông tin tài khoản!'});
    } catch (error) {
      console.error('Error saving user info:', error);
      openModal({type: 'error', message: error.response?.data?.message || 'Không thể cập nhật thông tin'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userInfo) {
      setForm({
        email: userInfo.email,
        fullName: userInfo.fullName || '',
        gender: userInfo.gender || 'male',
        dateOfBirth: userInfo.dateOfBirth ? formatDateForInput(userInfo.dateOfBirth) : '',
      });
    }
    setEdit(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Đang tải thông tin..." />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-5 py-4">
        <View className="flex-row justify-end mb-4">
          {!edit ? (
            <TouchableOpacity 
              onPress={() => setEdit(true)}
              className="bg-pink-50 p-2 rounded-full"
            >
              <Icon name="create-outline" size={24} color="#EC4899" />
            </TouchableOpacity>
          ) : (
            <View className="flex-row space-x-2">
              <TouchableOpacity 
                onPress={handleSave}
                className="bg-pink-500 px-4 py-2 rounded-full flex-row items-center"
              >
                <Icon name="checkmark" size={20} color="white" style={{ marginRight: 4 }} />
                <Text className="text-white font-medium">Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleCancel}
                className="bg-gray-200 px-4 py-2 rounded-full flex-row items-center"
              >
                <Icon name="close" size={20} color="#666" style={{ marginRight: 4 }} />
                <Text className="text-gray-600 font-medium">Hủy</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <InfoField
          label="Họ và tên"
          value={form.fullName}
          editable={true}
          edit={edit}
          onChangeText={(v) => setForm({ ...form, fullName: v })}
        />

        <InfoField
          label="Email"
          value={form.email}
          editable={false}
          edit={edit}
        />

        <InfoField
          label="Giới tính"
          value={form.gender}
          editable={true}
          edit={edit}
          type="options"
          options={genderOptions}
          onChangeText={(v) => setForm({ ...form, gender: v })}
        />

        <InfoField
          label="Ngày sinh"
          value={form.dateOfBirth}
          editable={true}
          edit={edit}
          onChangeText={(v) => setForm({ ...form, dateOfBirth: v })}
        />
      </View>
    </ScrollView>
  );
};

export default AccountInfoScreen; 