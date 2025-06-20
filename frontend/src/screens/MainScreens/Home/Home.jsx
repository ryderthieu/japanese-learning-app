import { Text, View, Image, ScrollView, TouchableOpacity, Alert, AppState } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from './CircularProgress';
import Slider from '../../../components/SlideCarousel/Slider';
import SliderData from '../../../components/SlideCarousel/SliderData';
import { useIsFocused } from '@react-navigation/native';
import userService from '../../../api/userService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [savedVocabulary, setSavedVocabulary] = useState([]);
  const [savedGrammar, setSavedGrammar] = useState([]);
  const [jlptStats, setJlptStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studyStreak, setStudyStreak] = useState(0); // Chuỗi ngày học thực tế
  const [todayStudyTime, setTodayStudyTime] = useState(0); // Thời gian học hôm nay (phút)
  const [isStudying, setIsStudying] = useState(false); // Trạng thái đang học
  const [lastActiveTime, setLastActiveTime] = useState(Date.now()); // Thời điểm active cuối
  
  const isFocus = useIsFocused();
  const { userInfo } = useAuth();
  const appState = useRef(AppState.currentState);
  const studyInterval = useRef(null);

  // Lấy thời gian mục tiêu từ studySettings
  const dailyGoal = userInfo?.studySettings?.studyDuration || 30;
  const studyPercentage = Math.min((todayStudyTime / dailyGoal) * 100, 100);

  // Hàm lấy ngày hiện tại dưới dạng string
  const getCurrentDateString = () => {
    return new Date().toDateString();
  };

  // Hàm tải chuỗi ngày học từ storage
  const loadStudyStreak = async () => {
    try {
      const storedStreak = await AsyncStorage.getItem('studyStreak');
      if (storedStreak) {
        const { lastStudyDate, streak } = JSON.parse(storedStreak);
        const today = getCurrentDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        // Nếu hôm qua không học thì reset streak
        if (lastStudyDate !== today && lastStudyDate !== yesterdayString) {
          setStudyStreak(0);
          await AsyncStorage.setItem('studyStreak', JSON.stringify({
            lastStudyDate: null,
            streak: 0
          }));
        } else {
          setStudyStreak(streak);
        }
      } else {
        // Lần đầu sử dụng
        await AsyncStorage.setItem('studyStreak', JSON.stringify({
          lastStudyDate: null,
          streak: 0
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải chuỗi ngày học:', error);
    }
  };

  // Hàm cập nhật chuỗi ngày học
  const updateStudyStreak = async (studyTime, goal) => {
    try {
      const today = getCurrentDateString();
      const storedStreak = await AsyncStorage.getItem('studyStreak');
      let currentStreak = 0;
      let lastStudyDate = null;
      
      if (storedStreak) {
        const data = JSON.parse(storedStreak);
        currentStreak = data.streak;
        lastStudyDate = data.lastStudyDate;
      }
      
      // Chỉ cập nhật nếu đạt mục tiêu và chưa cập nhật hôm nay
      if (studyTime >= goal && lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        // Nếu hôm qua có học thì tăng streak, không thì reset về 1
        const newStreak = lastStudyDate === yesterdayString ? currentStreak + 1 : 1;
        
        setStudyStreak(newStreak);
        await AsyncStorage.setItem('studyStreak', JSON.stringify({
          lastStudyDate: today,
          streak: newStreak
        }));
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật chuỗi ngày học:', error);
    }
  };

  // Hàm tải thời gian học từ storage
  const loadTodayStudyTime = async () => {
    try {
      const today = getCurrentDateString();
      const storedData = await AsyncStorage.getItem('dailyStudyTime');
      
      if (storedData) {
        const { date, minutes } = JSON.parse(storedData);
        
        // Nếu là ngày mới, reset về 0
        if (date !== today) {
          setTodayStudyTime(0);
          await AsyncStorage.setItem('dailyStudyTime', JSON.stringify({
            date: today,
            minutes: 0
          }));
        } else {
          setTodayStudyTime(minutes);
        }
      } else {
        // Lần đầu sử dụng app
        await AsyncStorage.setItem('dailyStudyTime', JSON.stringify({
          date: today,
          minutes: 0
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải thời gian học:', error);
    }
  };

  // Hàm lưu thời gian học vào storage
  const saveTodayStudyTime = async (minutes) => {
    try {
      const today = getCurrentDateString();
      await AsyncStorage.setItem('dailyStudyTime', JSON.stringify({
        date: today,
        minutes: minutes
      }));
      
      // Kiểm tra và cập nhật streak khi đạt mục tiêu
      await updateStudyStreak(minutes, dailyGoal);
    } catch (error) {
      console.error('Lỗi khi lưu thời gian học:', error);
    }
  };

  // Hàm bắt đầu auto-tracking khi app active
  const startAutoTracking = () => {
    if (!isStudying && !studyInterval.current) { // Kiểm tra cả isStudying và interval
      setIsStudying(true);
      const now = Date.now();
      setLastActiveTime(now);
      
      // Cập nhật thời gian mỗi phút
      studyInterval.current = setInterval(() => {
        const currentTime = Date.now();
        setLastActiveTime(prevTime => {
          const minutesPassed = Math.floor((currentTime - prevTime) / 1000 / 60);
          
          if (minutesPassed >= 1) {
            // Cập nhật thời gian học
            setTodayStudyTime(prev => {
              const newTime = prev + minutesPassed;
              saveTodayStudyTime(newTime);
              return newTime;
            });
            return currentTime; // Reset thời điểm reference
          }
          return prevTime; // Giữ nguyên nếu chưa đủ 1 phút
        });
      }, 60000); // Check mỗi phút
    }
  };

  // Hàm dừng auto-tracking khi app inactive
  const stopAutoTracking = () => {
    if (studyInterval.current) { // Chỉ cần kiểm tra interval
      // Lưu thời gian cuối trước khi dừng
      const currentTime = Date.now();
      const minutesPassed = Math.floor((currentTime - lastActiveTime) / 1000 / 60);
      
      if (minutesPassed >= 1) {
        setTodayStudyTime(prev => {
          const newTime = prev + minutesPassed;
          saveTodayStudyTime(newTime);
          return newTime;
        });
      }
      
      clearInterval(studyInterval.current);
      studyInterval.current = null;
      setIsStudying(false);
    }
  };

  // Monitor App State changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App vừa trở về foreground - bắt đầu tracking
        startAutoTracking();
      } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App vừa vào background - dừng tracking
        stopAutoTracking();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      stopAutoTracking();
    };
  }, []);

  // Monitor screen focus - chỉ start khi app active và screen focus
  useEffect(() => {
    if (isFocus && AppState.currentState === 'active') {
      startAutoTracking();
    } else if (!isFocus) {
      stopAutoTracking();
    }
  }, [isFocus]);

  // Khởi động tracking lần đầu
  useEffect(() => {
    if (AppState.currentState === 'active') {
      startAutoTracking();
    }
    
    return () => {
      stopAutoTracking();
    };
  }, []); // Chỉ chạy một lần khi mount

  // Tạo dữ liệu cho 7 ngày gần nhất dựa trên streak thực tế
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const isToday = i === 6;
    
    // Logic tính ngày đã học dựa trên streak
    let isStudied = false;
    
    if (isToday) {
      // Hôm nay: đã đạt mục tiêu hay chưa
      isStudied = todayStudyTime >= dailyGoal;
    } else {
      // Các ngày trước: chỉ hiển thị streak nếu có chuỗi liên tiếp
      const daysAgo = 6 - i; // 6, 5, 4, 3, 2, 1 ngày trước
      
      // Nếu hôm nay đã đạt mục tiêu và có streak
      if (todayStudyTime >= dailyGoal && studyStreak > 0) {
        // Hiển thị (streak - 1) ngày trước đó
        isStudied = daysAgo <= (studyStreak - 1);
      } 
      // Nếu hôm nay chưa đạt mục tiêu nhưng có streak từ trước
      else if (studyStreak > 0) {
        // Hiển thị streak ngày gần nhất (từ hôm qua về trước)
        isStudied = daysAgo <= studyStreak && daysAgo >= 1;
      }
    }
    
    return {
      day: date.getDate(),
      isStudied,
      isToday,
      studyTime: isStudied ? dailyGoal : 0
    };
  });

  const fetchSavedData = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserInfo();
      setSavedVocabulary(response.savedVocabulary || []);
      setSavedGrammar(response.savedGrammar || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      if (error.response?.status === 404) {
        Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJLPTStats = async () => {
    try {
      const stats = await userService.getJLPTStats();
      setJlptStats(stats);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê JLPT:', error);
      if (error.response?.status === 404) {
        Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
      }
    }
  };

  useEffect(() => {
    loadTodayStudyTime();
    loadStudyStreak(); // Load chuỗi ngày học
    fetchSavedData();
    fetchJLPTStats();
  }, [isFocus]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopAutoTracking();
    };
  }, []);

  return (
    <ScrollView
      className="flex flex-col pt-5"
      showsVerticalScrollIndicator={false}
    >
      <View>
        <View className="mb-3">
          <Slider itemList={SliderData} />
        </View>
        
        <View className="bg-white mx-5 rounded-xl shadow-md mb-6 overflow-hidden">
          {/* Header */}
          <View className="bg-gradient-to-r from-pink-50 to-blue-50 p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-[#2B308B] mb-1">
                  Thống kê học tập
                </Text>
                <Text className="text-xs text-gray-500">
                  Hôm nay • {new Date().toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <View className="items-center">
                <View className="flex-row items-center bg-orange-100 px-2 py-1 rounded-full">
                  <MaterialIcons name="local-fire-department" size={16} color="#F97316" />
                  <Text className="text-orange-600 font-bold text-sm ml-1">{studyStreak}</Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">ngày liên tiếp</Text>
              </View>
            </View>
          </View>

          {/* Study Progress */}
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <View className="flex-row items-baseline mb-2">
                  <Text className="text-3xl font-bold text-[#F472B6]">{todayStudyTime}</Text>
                  <Text className="text-lg font-semibold text-gray-500 mx-1">/</Text>
                  <Text className="text-2xl font-bold text-[#2B308B]">{dailyGoal}</Text>
                  <Text className="text-sm font-medium text-gray-600 ml-2">phút</Text>
                  {isStudying && (
                    <View className="ml-2 bg-green-100 px-2 py-1 rounded-full">
                      <Text className="text-green-600 text-xs font-semibold">● ĐANG HỌC</Text>
                    </View>
                  )}
                </View>
                <Text className="text-xs text-gray-500">
                  Đã hoàn thành {Math.round(studyPercentage)}% mục tiêu hôm nay
                </Text>
                
                <View className="bg-gray-200 h-2 rounded-full mt-2">
                  <View 
                    className="bg-gradient-to-r from-pink-400 to-pink-500 h-2 rounded-full z-10"
                    style={{ width: `${Math.round(studyPercentage)}%` }}
                  />
                </View>

                {/* Auto-tracking status */}
                <View className="mt-2">
                  <Text className="text-xs text-gray-400">
                    {isStudying ? '⏱️ Tự động đếm thời gian khi bạn sử dụng ứng dụng' : '⏸️ Tạm dừng khi không hoạt động'}
                  </Text>
                </View>
              </View>
              <View className="ml-4">
                <CircularProgress percentage={Math.round(studyPercentage)} />
              </View>
            </View>

            {/* 7-Day Streak Visualization */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">7 ngày gần nhất</Text>
              <View className="flex-row justify-between">
                {last7Days.map((day, index) => (
                  <View key={index} className="items-center">
                    <View 
                      className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                        day.isToday 
                          ? 'bg-pink-500' 
                          : day.isStudied 
                            ? 'bg-green-400' 
                            : 'bg-gray-200'
                      }`}
                    >
                      {day.isStudied ? (
                        <MaterialIcons 
                          name="check" 
                          size={16} 
                          color={day.isToday ? "white" : "white"} 
                        />
                      ) : (
                        <Text className="text-gray-400 text-xs font-bold">{day.day}</Text>
                      )}
                    </View>
                    <Text className={`text-xs font-medium ${
                      day.isToday ? 'text-pink-600' : 'text-gray-500'
                    }`}>
                      {day.isToday ? 'Hôm nay' : day.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="mx-5">
          <Text className="text-2xl font-bold text-[#2B308B] mb-4">
            Danh mục
          </Text>

          <View className="flex-row justify-around gap-3">
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-20 bg-white rounded-2xl shadow-md p-3"
              onPress={() => navigation.navigate("FreeDocumentNavigation")}
            >
              <MaterialIcons name="library-books" size={40} color="#F472B6" />
              <Text className="font-semibold text-base text-[#2B308B]">
                Tài liệu {"\n"}offline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-20 bg-white rounded-2xl shadow-md p-3"
              onPress={() => navigation.navigate("CoursesNavigation")}
            >
              <Ionicons name="school" size={40} color="#F472B6" />
              <Text className="font-semibold text-base text-[#2B308B]">
                Khóa học {"\n"}online
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around mt-4 gap-3">
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-20 bg-white rounded-2xl shadow-md p-3"
              onPress={() => navigation.navigate("JLPTNavigation")}
            >
              <MaterialIcons name="quiz" size={40} color="#F472B6" />
              <Text className="font-semibold text-base text-[#2B308B]">
                Thi thử
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row items-center justify-around gap-2 flex-1 h-20 bg-white rounded-2xl shadow-md p-3"
              onPress={() => navigation.navigate("Dictionary")}
            >
              <FontAwesome5 name="search" size={36} color="#F472B6" />
              <Text className="font-semibold text-base text-[#2B308B]">
                Tra từ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      <View className="mx-5 mt-8 mb-10">
        <Text className="text-2xl font-bold text-[#2B308B] mb-4">Đã lưu</Text>
        <View className="flex-row justify-around">
          <TouchableOpacity className="flex flex-col justify-center items-center w-[120px] h-[120px] bg-white rounded-3xl shadow-md" onPress={() => navigation.navigate('SavedVocabulary', {savedVocabulary})}>
            <View className="flex w-[50px] h-[50px] justify-center items-center mt-3 bg-secondary rounded-2xl">
              <Text className="font-bold text-white text-2xl">{savedVocabulary.length}</Text>
            </View>
            <Text className="font-bold text-lg mt-2 text-[#2B308B]">
              Từ vựng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-col justify-center items-center w-[120px] h-[120px] bg-white rounded-3xl shadow-md" onPress={() => navigation.navigate('SavedGrammar', {savedGrammar})}>
            <View className="w-[50px] h-[50px] justify-center items-center mt-3 bg-secondary rounded-2xl">
              <Text className="font-bold text-white text-2xl">{savedGrammar.length}</Text>
            </View>
            <Text className="font-bold text-lg mt-2 text-[#2B308B]">
              Ngữ pháp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
