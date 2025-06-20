import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ModalContext } from '../../../context/ModalContext';
import { LoadingContext, LoadingSpinner } from '../../../context/LoadingContext';
import userService from '../../../api/userService';

const PasswordInput = ({ label, value, onChangeText, showPassword, toggleShow, placeholder }) => (
  <View className="mb-4">
    <Text className="font-semibold mb-2 text-gray-600">{label}</Text>
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row items-center p-3">
        <TextInput
          className="flex-1 text-gray-700 text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          className="p-1" 
          onPress={toggleShow}
        >
          <Icon 
            name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
            size={20} 
            color="#EC4899" 
          />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { openModal } = useContext(ModalContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      openModal({type: 'error', message: 'Vui lòng điền đầy đủ thông tin'});
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      openModal({type: 'error', message: 'Mật khẩu mới không khớp'});
      return;
    }

    if (form.newPassword.length < 6) {
      openModal({type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự'});
      return;
    }

    try {
      setIsLoading(true);
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      openModal({
        type: 'success', 
        message: 'Đã đổi mật khẩu thành công!',
        onConfirm: () => navigation.goBack()
      });
    } catch (error) {
      openModal({type: 'error', message: error.response?.data?.message || 'Không thể đổi mật khẩu'});
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Đang xử lý..." />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-5 py-4">
        <View className="bg-pink-50 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Icon name="lock-closed" size={20} color="#EC4899" />
            <Text className="text-pink-500 font-bold text-base ml-2">Lưu ý</Text>
          </View>
          <Text className="text-gray-600">
            Mật khẩu mới cần có ít nhất 6 ký tự và khác với mật khẩu hiện tại.
          </Text>
        </View>

        <PasswordInput
          label="Mật khẩu hiện tại"
          value={form.currentPassword}
          onChangeText={(v) => setForm({ ...form, currentPassword: v })}
          showPassword={showPasswords.current}
          toggleShow={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
          placeholder="Nhập mật khẩu hiện tại"
        />

        <PasswordInput
          label="Mật khẩu mới"
          value={form.newPassword}
          onChangeText={(v) => setForm({ ...form, newPassword: v })}
          showPassword={showPasswords.new}
          toggleShow={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
          placeholder="Nhập mật khẩu mới"
        />

        <PasswordInput
          label="Xác nhận mật khẩu mới"
          value={form.confirmPassword}
          onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
          showPassword={showPasswords.confirm}
          toggleShow={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
          placeholder="Nhập lại mật khẩu mới"
        />

        <TouchableOpacity
          className="bg-pink-500 py-3.5 rounded-xl mt-6"
          onPress={handleChangePassword}
        >
          <Text className="text-white font-bold text-lg text-center">Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangePasswordScreen; 