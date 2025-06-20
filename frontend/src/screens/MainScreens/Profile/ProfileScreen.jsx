import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../api/userService';
import { ModalContext } from '../../../context/ModalContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userInfo, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [studyStats, setStudyStats] = useState(null);
  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Lấy thống kê JLPT và thống kê học tập
        const [jlptResponse, studyResponse] = await Promise.all([
          userService.getJLPTStats(),
          userService.getDetailedStudyProgress()
        ]);
        
        setStats(jlptResponse);
        setStudyStats(studyResponse.data || studyResponse);
        console.log('JLPT Stats:', jlptResponse);
        console.log('Study Stats:', studyResponse.data || studyResponse);
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      }
    };
    fetchStats(); 
  }, []);

  const handleLogout = () => {
    openModal({
      title: 'Đăng xuất',
      type: 'warning',
      message: 'Bạn có chắc chắn muốn đăng xuất?',
      onConfirm: () => {
        logout();
      }
    });
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Thông tin tài khoản',
      description: 'Thay đổi thông tin cá nhân',
      onPress: () => navigation.navigate('AccountInfo'),
      color: '#F490AF',
    },
    {
      icon: 'lock-closed-outline',
      title: 'Đổi mật khẩu',
      description: 'Thay đổi mật khẩu đăng nhập',
      onPress: () => navigation.navigate('ChangePassword'),
      color: '#F490AF',
    },
    {
      icon: 'settings-outline',
      title: 'Cài đặt học tập',
      description: 'Quản lý mục tiêu luyện tập',
      onPress: () => navigation.navigate('StudySettings'),
      color: '#F490AF',
    },
    {
      icon: 'help-circle-outline',
      title: 'Hỗ trợ',
      description: 'Liên hệ hỗ trợ, góp ý',
      onPress: () => navigation.navigate('Support'),
      color: '#F490AF',
    },
    {
      icon: 'log-out-outline',
      title: 'Đăng xuất',
      description: 'Thoát khỏi tài khoản',
      onPress: handleLogout,
      color: '#EF4444',
      danger: true,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-white p-6 mb-6">
        <View className="flex-row items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-pink-50 items-center justify-center">
            <Icon 
              name="person" 
              size={40} 
              color="#F490AF"
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {userInfo?.fullName || 'Người dùng'}
            </Text>
            <Text className="text-gray-500">
              {userInfo?.email || 'Email chưa cập nhật'}
            </Text>
          </View>
        </View>

        {/* Study Stats */}
        <View className="flex-row justify-between mt-2">
          <View className="items-center bg-pink-50 rounded-xl p-3 flex-1 mr-2">
            <Icon name="school" size={24} color="#F490AF" />
            <Text className="text-lg font-bold text-pink-500 mt-1">
              {stats?.currentLevel || 'N5'}
            </Text>
            <Text className="text-sm text-gray-600">Trình độ</Text>
          </View>
          <View className="items-center bg-pink-50 rounded-xl p-3 flex-1 mx-2">
            <Icon name="checkmark-circle" size={24} color="#F490AF" />
            <Text className="text-lg font-bold text-pink-500 mt-1">
              {stats?.completedTests || '0'}
            </Text>
            <Text className="text-sm text-gray-600">Bài đã học</Text>
          </View>
          <View className="items-center bg-pink-50 rounded-xl p-3 flex-1 ml-2">
            <Icon name="time" size={24} color="#F490AF" />
            <Text className="text-lg font-bold text-pink-500 mt-1">
              {studyStats?.monthlyStats?.daysStudied || '0'}
            </Text>
            <Text className="text-sm text-gray-600">Ngày học</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View className="px-5 py-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center bg-white rounded-2xl p-4 mb-3 border ${
              item.danger ? 'border-red-100' : 'border-gray-100'
            }`}
            onPress={item.onPress}
          >
            <View 
              className={`w-12 h-12 rounded-full items-center justify-center ${
                item.danger ? 'bg-red-50' : 'bg-pink-50'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={24} 
                color={item.color}
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className={`font-semibold text-base ${
                item.danger ? 'text-red-500' : 'text-gray-800'
              }`}>
                {item.title}
              </Text>
              <Text className={`text-sm ${
                item.danger ? 'text-red-400' : 'text-gray-500'
              }`}>
                {item.description}
              </Text>
            </View>
            <Icon 
              name="chevron-forward" 
              size={20} 
              color={item.danger ? '#EF4444' : '#F490AF'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen; 