import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { orderData, selectedCourses } = route.params;
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleGoToCourses = () => {
    navigation.navigate('DocumentStack', { 
      screen: 'MyCourse' 
    });
  };

  const handleGoHome = () => {
    navigation.navigate('HomeNavigation', {
      screen: 'Home'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header với background gradient */}
      <View style={styles.header}>
        <Animated.View 
          style={[
            styles.successIcon,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color="#00C851" />
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.successTitle,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          Thanh toán thành công
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.amountText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {formatCurrency(orderData.amount)}
        </Animated.Text>
      </View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Thông tin giao dịch */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin giao dịch</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã giao dịch</Text>
              <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
                {orderData.orderCode}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thời gian</Text>
              <Text style={styles.infoValue}>{new Date().toLocaleString('vi-VN')}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phương thức</Text>
              <Text style={styles.infoValue}>PayOS</Text>
            </View>
            
            <View style={[styles.infoRow, styles.borderTop]}>
              <Text style={styles.totalLabel}>Tổng tiền</Text>
              <Text style={styles.totalAmount}>{formatCurrency(orderData.amount)}</Text>
            </View>
          </View>

          {/* Chi tiết đơn hàng */}
          <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
            <Text style={styles.orderSubtitle}>{selectedCourses.length} khóa học</Text>
            
            {selectedCourses.map((course, index) => (
              <View key={course._id} style={styles.courseItem}>
                <Image
                  source={{ uri: course.thumbnail || course.imageUrl || 'https://via.placeholder.com/50x40' }}
                  style={styles.courseThumb}
                />
                <View style={styles.courseDetails}>
                  <Text style={styles.courseName} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <Text style={styles.coursePrice}>
                    {formatCurrency(course.price || 0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View 
        style={[
          styles.bottomActions,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleGoHome}
        >
          <Text style={styles.homeButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.courseButton}
          onPress={handleGoToCourses}
        >
          <Text style={styles.courseButtonText}>Vào học ngay</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    maxWidth: '60%',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F472B6',
  },
  orderSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  orderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  courseItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  courseThumb: {
    width: 50,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  courseDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  courseName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  coursePrice: {
    fontSize: 14,
    color: '#F472B6',
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  homeButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  courseButton: {
    flex: 1,
    backgroundColor: '#F472B6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  courseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PaymentSuccessScreen; 