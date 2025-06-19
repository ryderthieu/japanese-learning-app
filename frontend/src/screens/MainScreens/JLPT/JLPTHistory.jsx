import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import userService from '../../../api/userService';
import Icon from 'react-native-vector-icons/Ionicons';

const JLPTHistory = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Tất cả', icon: 'apps-outline' },
    { key: 'passed', label: 'Đạt', icon: 'checkmark-circle-outline' },
    { key: 'failed', label: 'Không đạt', icon: 'close-circle-outline' },
    { key: 'recent', label: 'Gần đây', icon: 'time-outline' },
  ];

  useEffect(() => {
    fetchHistory();
  }, [selectedFilter, currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      console.log('Fetching history from userService...');
      const response = await userService.getTestHistory(currentPage, 20);
      console.log('History response:', response);
      
      const newHistory = response.testAttempts || [];
      
      if (currentPage === 1) {
        setHistory(newHistory);
      } else {
        setHistory(prev => [...prev, ...newHistory]);
      }
      
      setHasMore(newHistory.length === 20);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử:', error);
      // Fallback với dữ liệu mẫu nếu API lỗi
      const sampleHistory = [
        {
          _id: '1',
          testId: {
            _id: 'test1',
            title: 'Đề thi JLPT N5 - Số 1',
            level: 'N5'
          },
          score: 15,
          maxScore: 20,
          timeSpent: 1800,
          completedAt: new Date().toISOString(),
          answers: []
        },
        {
          _id: '2', 
          testId: {
            _id: 'test2',
            title: 'Mini Test JLPT N5 - Số 2',
            level: 'N5'
          },
          score: 12,
          maxScore: 15,
          timeSpent: 900,
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          answers: []
        }
      ];
      
      if (currentPage === 1) {
        setHistory(sampleHistory);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleTestPress = (testResult) => {
    navigation.navigate('JLPTTestResult', { 
      result: testResult,
      testId: testResult.testId?._id || testResult.testId,
      test: testResult.testId
    });
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  const getStatusText = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 60) return 'Đạt';
    return 'Không đạt';
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderHistoryItem = (item) => (
    <TouchableOpacity
      key={item._id}
      className="bg-white rounded-xl p-4 shadow-md mb-3"
      onPress={() => handleTestPress(item)}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {item.testId?.title || 'Bài thi JLPT'}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">
            JLPT {item.testId?.level} • {new Date(item.completedAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        
        <View className="items-end">
          <View
            className={`px-3 py-1 rounded-full mb-2 ${
              getStatusText(item.score, item.maxScore) === 'Đạt'
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                getStatusText(item.score, item.maxScore) === 'Đạt'
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              {getStatusText(item.score, item.maxScore)}
            </Text>
          </View>
          
          <Text
            className="text-lg font-bold"
            style={{ color: getScoreColor(item.score, item.maxScore) }}
          >
            {Math.round((item.score / item.maxScore) * 100)}%
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Icon name="time-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1">
            {formatTime(item.timeSpent)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Icon name="help-circle-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1">
            {item.score} / {item.maxScore} điểm
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1">
            {new Date(item.completedAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && currentPage === 1) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#F490AF" />
        <Text className="text-lg text-gray-600 mt-4">Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-b from-teal-400 to-teal-600 p-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Lịch sử bài thi
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('JLPTStats')}
            className="p-2"
          >
            <Icon name="analytics-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
      >
        <View className="flex-row p-4">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${
                selectedFilter === filter.key
                  ? 'bg-teal-100 border border-teal-300'
                  : 'bg-gray-100'
              }`}
              onPress={() => {
                setSelectedFilter(filter.key);
                setCurrentPage(1);
              }}
            >
              <Icon
                name={filter.icon}
                size={16}
                color={selectedFilter === filter.key ? '#0D9488' : '#666'}
              />
              <Text
                className={`ml-2 text-sm font-medium ${
                  selectedFilter === filter.key ? 'text-teal-700' : 'text-gray-600'
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* History List */}
      <ScrollView
        className="flex-1 p-4"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {history.length > 0 ? (
          history.map(renderHistoryItem)
        ) : (
          <View className="bg-white rounded-xl p-8 shadow-md items-center">
            <Icon name="document-text-outline" size={48} color="#ccc" />
            <Text className="text-gray-500 text-lg mt-4 text-center">
              Chưa có lịch sử bài thi
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Hãy làm bài thi để xem lịch sử
            </Text>
          </View>
        )}
        
        {loading && currentPage > 1 && (
          <View className="py-4">
            <ActivityIndicator size="small" color="#0D9488" />
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('JLPTDashboard')}
            className="flex-1 bg-teal-500 py-3 rounded-xl"
          >
            <View className="flex-row items-center justify-center">
              <Icon name="play-outline" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold">
                Làm bài thi mới
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('JLPTStats')}
            className="flex-1 bg-gray-500 py-3 rounded-xl"
          >
            <View className="flex-row items-center justify-center">
              <Icon name="analytics-outline" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold">
                Thống kê
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default JLPTHistory; 