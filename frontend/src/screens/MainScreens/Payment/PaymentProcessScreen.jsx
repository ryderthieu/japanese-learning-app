import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Linking,
  Animated,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import paymentService from '../../../api/paymentService';
import userService from '../../../api/userService';
import { CartContext } from '../../../context/CartContext';
import { ModalContext } from '../../../context/ModalContext';

const PaymentProcessScreen = ({ navigation, route }) => {
  const { orderData, selectedCourses, fromCart } = route.params;
  const { setRefresh } = useContext(CartContext);
  const { openModal } = useContext(ModalContext);
  
  const [order, setOrder] = useState(orderData);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Intervals
  const countdownInterval = useRef(null);
  const statusCheckInterval = useRef(null);

  useEffect(() => {
    // Start animations
    startPulseAnimation();
    startFadeAnimation();
    
    // Start countdown
    startCountdown();
    
    // Start periodic status check
    startStatusCheck();
    
    // Set refresh function for header button
    navigation.setParams({ onRefresh: handleRefresh });
    
    return () => {
      // Cleanup intervals
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      if (statusCheckInterval.current) clearInterval(statusCheckInterval.current);
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startFadeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const startCountdown = () => {
    updateTimeRemaining();
    countdownInterval.current = setInterval(() => {
      updateTimeRemaining();
    }, 1000);
  };

  const updateTimeRemaining = () => {
    const remaining = paymentService.getTimeRemaining(order.expiredAt);
    setTimeRemaining(remaining);
    
    if (remaining.expired) {
      handlePaymentExpired();
    }
  };

  const startStatusCheck = () => {
    // Check status every 5 seconds
    statusCheckInterval.current = setInterval(() => {
      checkPaymentStatus();
    }, 5000);
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await paymentService.checkPaymentStatus(order.orderId);
      if (response.success) {
        const updatedOrder = response.data;
        setOrder(prev => ({ ...prev, ...updatedOrder }));
        
        if (updatedOrder.status === 'PAID') {
          handlePaymentSuccess();
        } else if (updatedOrder.status === 'CANCELLED' || updatedOrder.status === 'EXPIRED') {
          handlePaymentFailed(updatedOrder.status);
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  const handlePaymentSuccess = async () => {
    // Clear intervals
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (statusCheckInterval.current) clearInterval(statusCheckInterval.current);
    
    try {
      // Nếu thanh toán từ cart, xóa khóa học khỏi cart
      if (fromCart) {
        const courseIds = selectedCourses.map(course => course._id);
        await userService.removeFromCart({ courses: courseIds });
        setRefresh(prev => !prev);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
    
    // Navigate to success screen instead of showing modal
    navigation.replace('PaymentSuccess', {
      orderData: order,
      selectedCourses: selectedCourses
    });
  };

  const handlePaymentFailed = (status) => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (statusCheckInterval.current) clearInterval(statusCheckInterval.current);
    
    const message = status === 'EXPIRED' 
      ? 'Đơn hàng đã hết hạn thanh toán'
      : 'Thanh toán đã bị hủy';
      
    openModal({
      type: 'error',
      message: `Thanh toán không thành công\n\n${message}`,
      onConfirm: () => navigation.goBack(),
      onCancel: () => navigation.navigate('Home'),
      confirmText: 'Thử lại',
      cancelText: 'Về trang chủ'
    });
  };

  const handlePaymentExpired = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (statusCheckInterval.current) clearInterval(statusCheckInterval.current);
    
    openModal({
      type: 'warning',
      message: 'Đơn hàng đã hết hạn\n\nThời gian thanh toán đã hết. Vui lòng tạo đơn hàng mới.',
      onConfirm: () => navigation.goBack(),
      onCancel: () => navigation.navigate('Home'),
      confirmText: 'Tạo đơn mới',
      cancelText: 'Về trang chủ'
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkPaymentStatus();
    setRefreshing(false);
  };

  const handleOpenPaymentUrl = () => {
    if (order.paymentUrl) {
      Linking.openURL(order.paymentUrl);
    }
  };

  const handleCancelPayment = () => {
    openModal({
      type: 'confirm',
      message: 'Bạn có chắc chắn muốn hủy thanh toán này?',
      onConfirm: async () => {
        try {
          setLoading(true);
          const response = await paymentService.cancelOrder(order.orderId);
          if (response.success) {
            navigation.goBack();
          } else {
            openModal({type: 'error', message: response.message});
          }
        } catch (error) {
          openModal({type: 'error', message: 'Không thể hủy đơn hàng'});
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FF9500';
      case 'PAID': return '#34C759';
      case 'CANCELLED': return '#FF3B30';
      case 'EXPIRED': return '#8E8E93';
      default: return '#007AFF';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const CourseItem = ({ course }) => (
    <View style={styles.courseItem}>
      <Image
        source={{ uri: course.thumbnail || course.imageUrl || 'https://via.placeholder.com/60x45' }}
        style={styles.courseImage}
      />
      <View style={styles.courseInfo}>
        <Text style={styles.courseName} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.coursePrice}>
          {formatCurrency(course.price || 0)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <Animated.View style={[styles.statusCard, { opacity: fadeAnim }]}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(order.status) }]} />
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {paymentService.formatOrderStatus(order.status)}
            </Text>
            <Text style={styles.orderCode}>
              Mã đơn hàng: {order.orderCode}
            </Text>
          </View>
        </Animated.View>

        {/* Countdown Timer */}
        {order.status === 'PENDING' && timeRemaining && !timeRemaining.expired && (
          <View style={styles.timerCard}>
            <Ionicons name="time-outline" size={24} color="#FF9500" />
            <Text style={styles.timerText}>
              Thời gian còn lại: {timeRemaining.formatted}
            </Text>
          </View>
        )}

        {/* QR Code Card - Enhanced UI */}
        {order.status === 'PENDING' && order.qrCode && (
          <Animated.View style={[styles.qrCard, { opacity: fadeAnim }]}>
            <View style={styles.qrHeader}>
              <View style={styles.qrIconContainer}>
                <Ionicons name="qr-code" size={24} color="#007AFF" />
              </View>
              <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
              <Text style={styles.qrSubtitle}>
                Sử dụng ứng dụng ngân hàng hoặc ví điện tử
              </Text>
            </View>
            
            {/* QR Code with enhanced styling */}
            <View style={styles.qrContainer}>
              <View style={styles.qrFrame}>
                <Image
                  source={{ 
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(order.qrCode)}&color=000000&bgcolor=FFFFFF&margin=1`
                  }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
                {/* Corner decorations */}
                <View style={[styles.qrCorner, styles.qrCornerTopLeft]} />
                <View style={[styles.qrCorner, styles.qrCornerTopRight]} />
                <View style={[styles.qrCorner, styles.qrCornerBottomLeft]} />
                <View style={[styles.qrCorner, styles.qrCornerBottomRight]} />
              </View>
            </View>
            
            <View style={styles.qrActions}>
              <TouchableOpacity
                style={styles.openLinkButton}
                onPress={handleOpenPaymentUrl}
              >
                <Ionicons name="open-outline" size={18} color="#007AFF" />
                <Text style={styles.openLinkText}>Mở liên kết thanh toán</Text>
              </TouchableOpacity>
              
              <View style={styles.qrInfo}>
                <Ionicons name="information-circle-outline" size={16} color="#666" />
                <Text style={styles.qrInfoText}>
                  Mã QR sẽ tự động làm mới khi cần thiết
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Order Details */}
        <View style={styles.orderCard}>
          <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
          
          {/* Courses */}
          <View style={styles.coursesSection}>
            {selectedCourses.map((course, index) => (
              <CourseItem key={index} course={course} />
            ))}
          </View>
          
          {/* Total */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(order.amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Instructions */}
        {order.status === 'PENDING' && (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Hướng dẫn thanh toán</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1.</Text>
              <Text style={styles.instructionText}>
                Quét mã QR bằng app ngân hàng hoặc ví điện tử
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2.</Text>
              <Text style={styles.instructionText}>
                Hoặc nhấn "Mở liên kết thanh toán" để chọn phương thức
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3.</Text>
              <Text style={styles.instructionText}>
                Xác nhận thanh toán và chờ xử lý (tự động cập nhật)
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      {order.status === 'PENDING' && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.cancelButton, loading && styles.disabledButton]}
            onPress={handleCancelPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <Text style={styles.cancelButtonText}>Hủy thanh toán</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.checkStatusButton}
            onPress={handleRefresh}
          >
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.checkStatusText}>Kiểm tra lại</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderCode: {
    fontSize: 14,
    color: '#666',
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  timerText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrIconContainer: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qrFrame: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    position: 'relative',
  },
  qrImage: {
    width: 250,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  qrCorner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  qrCornerTopLeft: {
    top: 5,
    left: 5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  qrCornerTopRight: {
    top: 5,
    right: 5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  qrCornerBottomLeft: {
    bottom: 5,
    left: 5,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  qrCornerBottomRight: {
    bottom: 5,
    right: 5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  qrActions: {
    width: '100%',
    alignItems: 'center',
  },
  openLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  openLinkText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  qrInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  qrInfoText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  coursesSection: {
    marginBottom: 20,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  courseImage: {
    width: 60,
    height: 45,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  coursePrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    width: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFE6E6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  checkStatusButton: {
    flex: 1,
    backgroundColor: '#E8F8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  checkStatusText: {
    marginLeft: 8,
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PaymentProcessScreen; 