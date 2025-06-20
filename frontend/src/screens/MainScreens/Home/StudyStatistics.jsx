import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LoadingSpinner } from '../../../context/LoadingContext';
import userService from '../../../api/userService';

const { width } = Dimensions.get('window');

const StudyStatistics = ({ navigation }) => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [refreshing, setRefreshing] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchProgressData();
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching detailed study progress...');
      const response = await userService.getDetailedStudyProgress();
      console.log('Study progress response:', response);
      console.log('Weekly stats:', response?.weeklyStats || response?.data?.weeklyStats);
      console.log('Monthly stats:', response?.monthlyStats || response?.data?.monthlyStats);
      
      if (response && response.data) {
        setProgressData(response.data);
      } else if (response) {
        // Nếu response không có data field, response chính là data
        setProgressData(response);
      } else {
        throw new Error('Không có dữ liệu từ server');
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      console.log('Error details:', error.response?.data || error.message);
      
      // Fallback data for demo khi có lỗi - Sửa field name để match với backend
      setProgressData({
        todayStudyTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalStudyTime: 0,
        dailyGoal: 30,
        weeklyStats: { totalTime: 0, daysStudied: 0, goalsAchieved: 0 },
        monthlyStats: { totalTime: 0, daysStudied: 0, goalsAchieved: 0 },
        last30Days: Array(30).fill(false),
        goalAchievedToday: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProgressData();
    setRefreshing(false);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} phút`;
  };

  const getStreakGradient = (streak) => {
    if (streak >= 30) return ['#FFF4E6', '#FFE4CC']; // Cam nhạt gradient
    if (streak >= 14) return ['#FFF8E1', '#FFECB3']; // Vàng cam nhạt gradient  
    if (streak >= 7) return ['#FFFDE7', '#FFF9C4'];  // Vàng nhạt gradient
    if (streak >= 1) return ['#F8F9FA', '#E8F5E8'];  // Xanh lá nhạt gradient
    return ['#F8F9FA', '#F1F3F4']; // Xám nhạt gradient
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return '#FF8A50'; // Cam dịu
    if (streak >= 14) return '#FFB74D'; // Cam vàng dịu
    if (streak >= 7) return '#FDD835';  // Vàng dịu
    if (streak >= 1) return '#66BB6A';  // Xanh lá dịu
    return '#9CA3AF'; // Xám (chưa có streak)
  };

  const getStreakTextColor = (streak) => {
    if (streak >= 1) return '#2D3748'; // Xám đậm để đọc dễ
    return '#6B7280'; // Xám nhạt
  };

  const getStreakIconSize = (streak) => {
    if (streak >= 30) return 32; // Lửa to nhất
    if (streak >= 14) return 28; // Lửa to
    if (streak >= 7) return 26;  // Lửa vừa
    if (streak >= 1) return 24;  // Lửa nhỏ
    return 24; // Kích thước mặc định
  };

  const StatCard = ({ title, value, icon, color, subtitle, bgColor, iconSize = 24 }) => (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [{
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })
        }]
      }}
      className="flex-1 mx-2"
    >
      <View
        className="rounded-2xl p-4 shadow-lg"
        style={{
          backgroundColor: bgColor || color,
          elevation: 8,
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="bg-white/20 rounded-full p-2">
            <MaterialIcons name={icon} size={iconSize} color="white" />
          </View>
          <Text className="text-white/80 text-xs font-medium">{title}</Text>
        </View>
        <Text className="text-white text-2xl font-bold mb-1">{value}</Text>
        {subtitle && (
          <Text className="text-white/70 text-xs">{subtitle}</Text>
        )}
      </View>
    </Animated.View>
  );

  const ProgressBar = ({ progress, color, height = 8 }) => (
    <View className={`bg-gray-200 rounded-full overflow-hidden`} style={{ height }}>
      <View
        className="h-full rounded-full"
        style={{
          backgroundColor: color,
          width: `${Math.min(progress, 100)}%`
        }}
      />
    </View>
  );

  const DayCircle = ({ isStudied, dayNumber }) => (
    <View className="items-center mb-2">
      <View
        className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
          isStudied ? 'bg-pink-500' : 'bg-gray-200'
        }`}
      >
        <Text className={`text-xs font-bold ${isStudied ? 'text-white' : 'text-gray-400'}`}>
          {dayNumber}
        </Text>
      </View>
    </View>
  );

  const WeeklyChart = () => {
    const weekData = progressData?.last30Days?.slice(-7) || Array(7).fill(false);
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    
    return (
      <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-lg" style={{ elevation: 4 }}>
        <Text className="text-lg font-bold text-gray-800 mb-4">Tuần này</Text>
        <View className="flex-row justify-around items-end" style={{ height: 120 }}>
          {weekData.map((studied, index) => (
            <View key={index} className="items-center">
              <Animated.View
                className={`w-8 rounded-t-lg mb-2 ${studied ? 'bg-pink-500' : 'bg-gray-200'}`}
                style={{
                  height: studied ? 80 : 20,
                  transform: [{
                    scaleY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    })
                  }]
                }}
              />
              <Text className="text-xs text-gray-600 font-medium">{days[index]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const MonthlyHeatmap = () => {
    const monthData = progressData?.last30Days || Array(30).fill(false);
    
    return (
      <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-lg" style={{ elevation: 4 }}>
        <Text className="text-lg font-bold text-gray-800 mb-4">30 ngày gần nhất</Text>
        <View className="flex-row flex-wrap justify-center">
          {monthData.map((studied, index) => (
            <View key={index} className="m-0.5">
              <View
                className={`w-6 h-6 rounded ${studied ? 'bg-pink-500' : 'bg-gray-200'}`}
                style={{
                  opacity: studied ? (0.3 + Math.random() * 0.7) : 1
                }}
              />
            </View>
          ))}
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xs text-gray-500">Ít</Text>
          <View className="flex-row space-x-1">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, index) => (
              <View
                key={index}
                className="w-3 h-3 rounded bg-pink-500"
                style={{ opacity }}
              />
            ))}
          </View>
          <Text className="text-xs text-gray-500">Nhiều</Text>
        </View>
      </View>
    );
  };

  const AchievementBadge = ({ title, description, earned, icon }) => (
    <View 
      className={`flex-row items-center p-3 rounded-xl mr-3 ${
        earned ? 'bg-yellow-500' : 'bg-gray-100'
      }`} 
      style={{ width: 200 }}
    >
      <View className={`w-12 h-12 rounded-full items-center justify-center ${
        earned ? 'bg-white/20' : 'bg-gray-300'
      }`}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={earned ? 'white' : '#9CA3AF'} 
        />
      </View>
      <View className="flex-1 ml-3">
        <Text className={`font-bold text-sm ${earned ? 'text-white' : 'text-gray-500'}`}>
          {title}
        </Text>
        <Text className={`text-xs ${earned ? 'text-white/80' : 'text-gray-400'}`}>
          {description}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="Đang tải thống kê..." />;
  }

  if (!progressData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <MaterialIcons name="error-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
          Không thể tải dữ liệu
        </Text>
        <TouchableOpacity
          onPress={fetchProgressData}
          className="bg-pink-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStats = selectedPeriod === 'weekly' ? progressData.weeklyStats : progressData.monthlyStats;
  const goalProgress = (currentStats?.goalsAchieved || 0) / (selectedPeriod === 'weekly' ? 7 : 30) * 100;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Streak Card - Design nhất quán với các card khác */}
      <View className="px-4 pt-4 pb-2">
        <Animated.View
          style={{
            opacity: animatedValue,
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })
            }]
          }}
        >
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg" style={{ elevation: 4 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-800">Chuỗi học liên tiếp</Text>
              <View className="flex-row items-center">
                {[...Array(Math.min(5, Math.floor(progressData.currentStreak / 7)))].map((_, i) => (
                  <MaterialIcons key={i} name="star" size={16} color={getStreakColor(progressData.currentStreak)} />
                ))}
              </View>
            </View>

            {/* Main Content */}
            <View className="flex-row items-center mb-4">
              {/* Icon Section */}
              <View 
                className="rounded-2xl p-4 mr-4"
                style={{ backgroundColor: getStreakColor(progressData.currentStreak) + '20' }}
              >
                <MaterialIcons 
                  name="local-fire-department" 
                  size={getStreakIconSize(progressData.currentStreak)} 
                  color={getStreakColor(progressData.currentStreak)} 
                />
              </View>

              {/* Stats Section */}
              <View className="flex-1">
                <View className="flex-row items-baseline mb-2">
                  <Text 
                    className="text-4xl font-bold mr-2"
                    style={{ color: getStreakColor(progressData.currentStreak) }}
                  >
                    {progressData.currentStreak}
                  </Text>
                  <Text className="text-gray-600 text-lg font-medium">ngày</Text>
                </View>
                <Text className="text-gray-500 text-sm">
                  Kỷ lục: {progressData.longestStreak} ngày
                </Text>
              </View>

              {/* Badge Level */}
              <View 
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: getStreakColor(progressData.currentStreak) + '20' }}
              >
                <Text 
                  className="text-xs font-bold"
                  style={{ color: getStreakColor(progressData.currentStreak) }}
                >
                  {progressData.currentStreak === 0 
                    ? "Mới bắt đầu" 
                    : progressData.currentStreak < 7
                    ? "Người mới"
                    : progressData.currentStreak < 14
                    ? "Tích cực"
                    : progressData.currentStreak < 30
                    ? "Chuyên gia"
                    : "Bậc thầy"
                  }
                </Text>
              </View>
            </View>

            {/* Progress to next level */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600 text-sm">Tiến độ lên cấp</Text>
                <Text className="text-gray-500 text-xs">
                  {progressData.currentStreak % 7}/7
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: getStreakColor(progressData.currentStreak),
                    width: `${Math.min(100, (progressData.currentStreak % 7) / 7 * 100)}%`
                  }}
                />
              </View>
            </View>
            
            {/* Motivational message */}
            <View 
              className="rounded-xl p-3"
              style={{ backgroundColor: getStreakColor(progressData.currentStreak) + '10' }}
            >
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="emoji-events" size={18} color={getStreakColor(progressData.currentStreak)} />
                <Text 
                  className="font-medium text-sm ml-2"
                  style={{ color: getStreakColor(progressData.currentStreak) }}
                >
                  {progressData.currentStreak === 0 
                    ? "Bắt đầu hành trình" 
                    : progressData.currentStreak < 7
                    ? "Đang trên đà tốt!"
                    : progressData.currentStreak < 14
                    ? "Xuất sắc!"
                    : progressData.currentStreak < 30
                    ? "Đáng kinh ngạc!"
                    : "Hoàn hảo!"
                  }
                </Text>
              </View>
              <Text className="text-gray-600 text-sm leading-5">
                {progressData.currentStreak === 0 
                  ? "🎯 Bắt đầu streak đầu tiên của bạn hôm nay!" 
                  : progressData.currentStreak < 7
                  ? `🔥 Còn ${7 - progressData.currentStreak} ngày để trở thành "Học viên tích cực"`
                  : progressData.currentStreak < 14
                  ? `⭐ Còn ${14 - progressData.currentStreak} ngày để trở thành "Chuyên gia"`
                  : progressData.currentStreak < 30
                  ? `💎 Còn ${30 - progressData.currentStreak} ngày để trở thành "Bậc thầy"`
                  : "🏆 Bạn đã đạt cấp độ cao nhất!"
                }
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Biểu đồ tuần */}
      <WeeklyChart />

      {/* Toggle Period */}
      <View className="flex-row mx-4 mb-4 bg-white rounded-2xl p-1 shadow-lg" style={{ elevation: 4 }}>
        {['weekly', 'monthly'].map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            className={`flex-1 py-3 rounded-xl ${
              selectedPeriod === period ? 'bg-pink-500' : 'bg-transparent'
            }`}
          >
            <Text className={`text-center font-bold ${
              selectedPeriod === period ? 'text-white' : 'text-gray-600'
            }`}>
              {period === 'weekly' ? 'Tuần này' : 'Tháng này'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Thống kê chi tiết */}
      <View className="bg-white rounded-2xl mx-4 mb-4 p-4 shadow-lg" style={{ elevation: 4 }}>
        <Text className="text-lg font-bold text-gray-800 mb-4">
          {selectedPeriod === 'weekly' ? 'Tuần này' : 'Tháng này'}
        </Text>
        
        <View className="space-y-4">
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Tổng thời gian</Text>
              <Text className="font-bold text-pink-600">
                {formatTime(currentStats?.totalTime || 0)}
              </Text>
            </View>
            <ProgressBar progress={(currentStats?.totalTime || 0) / 10} color="#F472B6" />
          </View>

          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Ngày học</Text>
              <Text className="font-bold text-blue-600">
                {currentStats?.daysStudied || 0}/{selectedPeriod === 'weekly' ? 7 : 30}
              </Text>
            </View>
            <ProgressBar 
              progress={(currentStats?.daysStudied || 0) / (selectedPeriod === 'weekly' ? 7 : 30) * 100} 
              color="#3B82F6" 
            />
          </View>

          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Mục tiêu đạt được</Text>
              <Text className="font-bold text-green-600">
                {currentStats?.goalsAchieved || 0}
              </Text>
            </View>
            <ProgressBar progress={goalProgress} color="#10B981" />
          </View>
        </View>
      </View>

      {/* Heatmap 30 ngày */}
      <MonthlyHeatmap />

      {/* Thành tích */}
      <View className="bg-white rounded-2xl mx-4 mb-4 p-4 shadow-lg" style={{ elevation: 4 }}>
        <Text className="text-lg font-bold text-gray-800 mb-4">Thành tích</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <AchievementBadge
            title="Người mới bắt đầu"
            description="Hoàn thành ngày đầu tiên"
            earned={progressData.currentStreak >= 1}
            icon="stars"
          />
          <AchievementBadge
            title="Kiên trì"
            description="Học 7 ngày liên tiếp"
            earned={progressData.currentStreak >= 7}
            icon="trending-up"
          />
          <AchievementBadge
            title="Chuyên gia"
            description="Học 30 ngày liên tiếp"
            earned={progressData.currentStreak >= 30}
            icon="emoji-events"
          />
          <AchievementBadge
            title="Kỷ lục"
            description={`Streak dài nhất: ${progressData.longestStreak} ngày`}
            earned={progressData.longestStreak >= 1}
            icon="military-tech"
          />
        </ScrollView>
      </View>

      {/* Gợi ý */}
      <View className="bg-blue-500 rounded-2xl mx-4 mb-6 p-4">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="lightbulb" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Gợi ý cho bạn</Text>
        </View>
        <Text className="text-white/90 text-sm leading-5">
          {progressData.currentStreak === 0 
            ? "Hãy bắt đầu streak mới bằng cách học ít nhất 15 phút hôm nay!"
            : progressData.currentStreak < 7
            ? `Tuyệt vời! Bạn đã học ${progressData.currentStreak} ngày liên tiếp. Hãy tiếp tục để đạt mục tiêu 7 ngày!`
            : "Bạn đang làm rất tốt! Hãy duy trì thói quen học tập đều đặn này."
          }
        </Text>
      </View>
    </ScrollView>
  );
};

export default StudyStatistics; 