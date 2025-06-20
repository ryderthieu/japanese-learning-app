import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ModalContext } from '../../../context/ModalContext';
import { LoadingSpinner } from '../../../context/LoadingContext';
import { useAuth } from '../../../context/AuthContext';
import NotificationService from '../../../services/NotificationService';

const TimePickerModal = ({ visible, onClose, currentTime, onTimeSelected }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  useEffect(() => {
    if (currentTime) {
      const [h, m] = currentTime.split(':');
      setHours(h);
      setMinutes(m);
    }
  }, [currentTime]);

  const handleSave = () => {
    let h = parseInt(hours);
    let m = parseInt(minutes);

    // Nếu không nhập gì thì mặc định là 00
    if (isNaN(h)) h = 0;
    if (isNaN(m)) m = 0;

    // Kiểm tra giới hạn
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      return;
    }

    const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onTimeSelected(formattedTime);
    onClose();
  };

  const handleChangeHours = (text) => {
    const num = parseInt(text);
    if (text === '' || (!isNaN(num) && num >= 0 && num <= 23)) {
      setHours(text);
    }
  };

  const handleChangeMinutes = (text) => {
    const num = parseInt(text);
    if (text === '' || (!isNaN(num) && num >= 0 && num <= 59)) {
      setMinutes(text);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 mx-4 w-80">
          <Text className="text-lg font-bold text-center mb-4">Chọn thời gian nhắc nhở</Text>
          
          <View className="flex-row justify-center items-center mb-6">
            <View className="items-center">
              <Text className="text-sm text-gray-500 mb-2">Giờ</Text>
              <TextInput
                className="border border-gray-300 rounded-lg w-16 h-12 text-center text-lg"
                value={hours}
                onChangeText={handleChangeHours}
                placeholder="00"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            
            <Text className="text-2xl mx-4 mt-6">:</Text>
            
            <View className="items-center">
              <Text className="text-sm text-gray-500 mb-2">Phút</Text>
              <TextInput
                className="border border-gray-300 rounded-lg w-16 h-12 text-center text-lg"
                value={minutes}
                onChangeText={handleChangeMinutes}
                placeholder="00"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
          
          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 rounded-lg mr-2"
            >
              <Text className="text-gray-600 font-medium">Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="bg-pink-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const StudySettingsScreen = () => {
  const { openModal } = useContext(ModalContext);
  const { isLoading } = useAuth();
  const { userInfo, updateUserInfo } = useAuth();
  const [form, setForm] = useState(userInfo?.studySettings || {
    studyDuration: 30,
    reminder: {
      enabled: true,
      time: '08:00'
    }
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [jlptLevel, setJlptLevel] = useState(userInfo?.jlptLevel || 'Beginner');
  const [targetLevel, setTargetLevel] = useState(userInfo?.targetLevel || 'N5');

  const jlptLevels = [
    { value: 'Beginner', label: 'Mới bắt đầu', color: '#6B7280', description: 'Chưa có kiến thức tiếng Nhật' },
    { value: 'N5', label: 'N5 - Sơ cấp', color: '#10B981', description: 'Hiểu được các cụm từ và câu cơ bản' },
    { value: 'N4', label: 'N4 - Tiền trung cấp', color: '#3B82F6', description: 'Hiểu được tiếng Nhật cơ bản' },
    { value: 'N3', label: 'N3 - Trung cấp', color: '#F59E0B', description: 'Hiểu được tiếng Nhật hàng ngày' },
    { value: 'N2', label: 'N2 - Trung cấp cao', color: '#EF4444', description: 'Hiểu được tiếng Nhật trong nhiều tình huống' },
    { value: 'N1', label: 'N1 - Cao cấp', color: '#8B5CF6', description: 'Hiểu được tiếng Nhật trong mọi tình huống' }
  ];

  // Levels cho mục tiêu (loại bỏ Mới bắt đầu)
  const targetLevels = jlptLevels.filter(level => level.value !== 'Beginner');

  useEffect(() => {
    if (userInfo?.studySettings) {
      setForm(userInfo.studySettings);
    }
    if (userInfo?.jlptLevel) {
      setJlptLevel(userInfo.jlptLevel);
    }
    if (userInfo?.targetLevel) {
      setTargetLevel(userInfo.targetLevel);
    }
    requestNotificationPermission();
  }, [userInfo]);

  const requestNotificationPermission = async () => {
    try {
      const status = await NotificationService.requestPermission();
      if (!status) {
        openModal({
          type: 'warning',
          message: 'Vui lòng cấp quyền thông báo để nhận nhắc nhở học tập'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleTimeSelected = (time) => {
    setForm({
      ...form,
      reminder: {
        ...form.reminder,
        time
      }
    });
  };

  const handleToggleReminder = (enabled) => {
    setForm({
      ...form,
      reminder: {
        ...form.reminder,
        enabled
      }
    });
  };

  const handleSaveSettings = async () => {
    if (form.studyDuration < 5 || form.studyDuration > 180) {
      openModal({
        type: 'error',
        message: 'Thời gian học tập phải từ 5 đến 180 phút'
      });
      return;
    }

    // Kiểm tra logic level (chỉ áp dụng nếu không phải Beginner)
    if (jlptLevel !== 'Beginner') {
      const levels = ['Beginner', 'N5', 'N4', 'N3', 'N2', 'N1'];
      const currentIndex = levels.indexOf(jlptLevel);
      const targetIndex = levels.indexOf(targetLevel);
      
      if (targetIndex <= currentIndex) {
        openModal({
          type: 'error',
          message: 'Mục tiêu phải cao hơn trình độ hiện tại'
        });
        return;
      }
    }

    try {
      // Cập nhật toàn bộ thông tin người dùng
      const updatedUserInfo = {
        jlptLevel,
        targetLevel,
        studySettings: form
      };
      await updateUserInfo(updatedUserInfo);
      
      // Xử lý notification
      if (form.reminder.enabled) {
        try {
          await NotificationService.createStudyReminder(form.reminder.time);
        } catch (error) {
          console.error('Error creating notification:', error);
        }
      } else {
        await NotificationService.cancelAllNotifications();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const LevelSelector = ({ title, selectedLevel, onLevelChange, options }) => (
    <View className="mb-4">
      <Text className="font-bold text-gray-700 text-base mb-2">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((level) => {
          // Hiển thị label rút gọn
          const displayLabel = level.value === 'Beginner' ? 'Mới' : level.value;
          
          return (
            <TouchableOpacity
              key={level.value}
              onPress={() => onLevelChange(level.value)}
              className={`items-center justify-center px-3 py-2 rounded-lg border min-w-[45px] ${
                selectedLevel === level.value 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-300 bg-white'
              }`}
            >
              <Text className={`text-sm font-bold ${
                selectedLevel === level.value ? 'text-pink-600' : 'text-gray-700'
              }`}>
                {displayLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="Đang tải cài đặt..." />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-5 py-4">
        <View className="bg-pink-50 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Icon name="settings" size={20} color="#EC4899" />
            <Text className="text-pink-500 font-bold text-base ml-2">Cài đặt học tập</Text>
          </View>
          <Text className="text-gray-600">
            Tùy chỉnh trải nghiệm học tập của bạn với các cài đặt dưới đây.
          </Text>
        </View>

        {/* JLPT Levels Explanation */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="font-bold text-gray-700 text-lg mb-4">Các trình độ JLPT</Text>
          <View className="space-y-3">
            {jlptLevels.map((level) => (
              <View key={level.value} className="flex-row items-center">
                <View 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: level.color }}
                />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-700 text-base">
                    {level.label}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {level.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Level Selection */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="font-bold text-gray-700 text-lg mb-4">Chọn trình độ và mục tiêu</Text>
          
          <LevelSelector
            title="Trình độ hiện tại"
            selectedLevel={jlptLevel}
            onLevelChange={setJlptLevel}
            options={jlptLevels}
          />
          
          <LevelSelector
            title="Mục tiêu"
            selectedLevel={targetLevel}
            onLevelChange={setTargetLevel}
            options={targetLevels}
          />
        </View>

        {/* Study Duration */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="font-bold text-gray-700 text-lg mb-3">Thời gian học mỗi ngày</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base"
              value={form.studyDuration?.toString()}
              onChangeText={(value) => setForm({ ...form, studyDuration: parseInt(value) || 0 })}
              placeholder="30"
              keyboardType="numeric"
            />
            <Text className="text-gray-600 ml-3 text-base">phút</Text>
          </View>
          <Text className="text-gray-500 text-sm mt-2">
            Thời gian học tập mỗi ngày (từ 5 đến 180 phút)
          </Text>
        </View>

        {/* Study Reminder */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-gray-700 text-lg">Nhắc nhở học tập</Text>
            <Switch
              value={form.reminder?.enabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: '#D1D5DB', true: '#FDF2F8' }}
              thumbColor={form.reminder?.enabled ? '#EC4899' : '#9CA3AF'}
            />
          </View>
          
          {form.reminder?.enabled && (
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="flex-row items-center justify-between bg-gray-50 rounded-xl p-3"
            >
              <View className="flex-row items-center">
                <Icon name="time-outline" size={20} color="#EC4899" />
                <Text className="text-gray-700 ml-2">Thời gian nhắc nhở</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-700 font-medium mr-2">{form.reminder?.time}</Text>
                <Icon name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveSettings}
          className="bg-pink-500 rounded-2xl py-4 items-center shadow-sm"
        >
          <Text className="text-white font-bold text-lg">Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        currentTime={form.reminder?.time}
        onTimeSelected={handleTimeSelected}
      />
    </ScrollView>
  );
};

export default StudySettingsScreen; 