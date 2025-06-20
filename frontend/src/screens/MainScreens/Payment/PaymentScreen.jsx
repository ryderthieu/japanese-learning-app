import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import courseService from '../../../api/courseService';
import paymentService from '../../../api/paymentService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalContext } from '../../../context/ModalContext';

const PaymentScreen = ({ navigation, route }) => {
  const { openModal } = useContext(ModalContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Lấy courseId từ route params nếu có
  const { preSelectedCourseId } = route.params || {};

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Nếu có courseId được truyền từ màn hình khác
    if (preSelectedCourseId && courses.length > 0) {
      const course = courses.find(c => c._id === preSelectedCourseId);
      if (course && !selectedCourses.find(sc => sc._id === course._id)) {
        handleSelectCourse(course);
      }
    }
  }, [preSelectedCourseId, courses]);

  useEffect(() => {
    calculateTotal();
  }, [selectedCourses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      openModal({
        type: 'error',
        message: 'Không thể tải danh sách khóa học'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course) => {
    const isSelected = selectedCourses.find(sc => sc._id === course._id);
    if (isSelected) {
      setSelectedCourses(selectedCourses.filter(sc => sc._id !== course._id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const calculateTotal = () => {
    const total = selectedCourses.reduce((sum, course) => sum + (course.price || 0), 0);
    setTotalAmount(total);
  };

  const handleProceedToPayment = async () => {
    if (selectedCourses.length === 0) {
      openModal({
        type: 'warning',
        message: 'Vui lòng chọn ít nhất một khóa học'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Debug: Kiểm tra token
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 Payment Screen Token check:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        openModal({
          type: 'error',
          message: 'Bạn cần đăng nhập để thực hiện thanh toán. Vui lòng đăng nhập lại.',
          onConfirm: () => navigation.navigate('Login')
        });
        return;
      }
      
      const paymentData = {
        items: selectedCourses.map(course => ({
          courseId: course._id,
          quantity: 1
        })),
        returnUrl: 'japaneselearningapp://payment/success',
        cancelUrl: 'japaneselearningapp://payment/cancel'
      };

      console.log('💳 PaymentScreen Payment data:', paymentData);

      const response = await paymentService.createPayment(paymentData);
      
      if (response.success) {
        // Chuyển đến màn hình thanh toán
        navigation.navigate('PaymentProcess', {
          orderData: response.data,
          selectedCourses: selectedCourses
        });
      } else {
        openModal({
          type: 'error',
          message: response.message || 'Không thể tạo thanh toán'
        });
      }
    } catch (error) {
      console.error('PaymentScreen Payment error:', error);
      
      // Xử lý lỗi auth
      if (error.status === 401) {
        openModal({
          type: 'error',
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          onConfirm: () => {
            AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          }
        });
      } else {
        openModal({
          type: 'error',
          message: error.message || 'Có lỗi xảy ra khi tạo thanh toán'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CourseItem = ({ course }) => {
    const isSelected = selectedCourses.find(sc => sc._id === course._id);
    
    return (
      <TouchableOpacity
        style={[styles.courseItem, isSelected && styles.selectedCourse]}
        onPress={() => handleSelectCourse(course)}
      >
        <View style={styles.courseContent}>
          <Image
            source={{ uri: course.imageUrl || 'https://via.placeholder.com/80x60' }}
            style={styles.courseImage}
          />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDescription} numberOfLines={2}>
              {course.description}
            </Text>
            <Text style={styles.coursePrice}>
              {paymentService.formatCurrency(course.price || 0)}
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Ionicons
              name={isSelected ? 'checkbox' : 'checkbox-outline'}
              size={24}
              color={isSelected ? '#007AFF' : '#666'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm khóa học..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Selected Courses Summary */}
      {selectedCourses.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Đã chọn {selectedCourses.length} khóa học
          </Text>
          <Text style={styles.summaryAmount}>
            {paymentService.formatCurrency(totalAmount)}
          </Text>
        </View>
      )}

      {/* Course List */}
      <ScrollView style={styles.courseList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải khóa học...</Text>
          </View>
        ) : filteredCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy khóa học nào</Text>
          </View>
        ) : (
          filteredCourses.map((course) => (
            <CourseItem key={course._id} course={course} />
          ))
        )}
      </ScrollView>

      {/* Payment Button */}
      {selectedCourses.length > 0 && (
        <View style={styles.paymentContainer}>
          <TouchableOpacity
            style={[styles.paymentButton, loading && styles.disabledButton]}
            onPress={handleProceedToPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.paymentButtonText}>
                  Thanh toán {paymentService.formatCurrency(totalAmount)}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  courseList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  courseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCourse: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  courseContent: {
    flexDirection: 'row',
    padding: 15,
  },
  courseImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  courseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  paymentContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
});

export default PaymentScreen; 