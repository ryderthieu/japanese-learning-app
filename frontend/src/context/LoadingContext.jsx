import React, { createContext, useState, useContext } from 'react';
import Loading from '../components/Loading/Loading';
import { View, ActivityIndicator, Text } from 'react-native';

export const LoadingContext = createContext();

/**
 * ⭐ COMPONENT CHÍNH CHO MỌI TRANG LOADING ⭐
 * Màn hình loading với spinner, dùng cho loading toàn màn hình
 * @param {string} size - Kích thước spinner: "small" | "large" 
 * @param {string} color - Màu sắc (mặc định: #F472B6)
 * @param {string} text - Text hiển thị (có thể null)
 * @param {object} style - Style bổ sung
 */
export const LoadingSpinner = ({ size = "large", color = "#F472B6", text = null, style = {} }) => (
  <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }, style]}>
    <ActivityIndicator size={size} color={color} />
    {text && (
      <Text style={{ 
        marginTop: 12, 
        fontSize: 16, 
        color: '#6b7280', 
        textAlign: 'center',
        fontWeight: '500' 
      }}>
        {text}
      </Text>
    )}
  </View>
);

/**
 * Loading overlay che toàn màn hình với nền mờ
 * @param {boolean} visible - Hiển thị overlay
 * @param {string} text - Text hiển thị
 * @param {string} color - Màu spinner
 */
export const LoadingOverlay = ({ visible, text = "Đang tải...", color = "#F472B6" }) => {
  if (!visible) return null;
  
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      elevation: 9999
    }}>
      <View style={{
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      }}>
        <ActivityIndicator size="large" color={color} />
        <Text style={{ 
          marginTop: 12, 
          fontSize: 16, 
          color: '#374151',
          textAlign: 'center',
          fontWeight: '500' 
        }}>
          {text}
        </Text>
      </View>
    </View>
  );
};

/**
 * Loading inline, dùng trong danh sách hoặc phần tử nhỏ
 * @param {string} text - Text hiển thị
 * @param {string} color - Màu spinner  
 * @param {string} size - Kích thước spinner
 */
export const InlineLoading = ({ text = "Đang tải...", color = "#F472B6", size = "small" }) => (
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 16 
  }}>
    <ActivityIndicator size={size} color={color} />
    <Text style={{ 
      marginLeft: 8, 
      fontSize: 14, 
      color: '#6b7280',
      fontWeight: '500' 
    }}>
      {text}
    </Text>
  </View>
);

/**
 * 🎯 HƯỚNG DẪN SỬ DỤNG LOADING THỐNG NHẤT:
 * 
 * ⭐ CHỈ SỬ DỤNG LoadingSpinner CHO TẤT CẢ CÁC TRANG:
 *    if (loading) return <LoadingSpinner text="Đang tải dữ liệu..." />
 * 
 * 📋 InlineLoading cho danh sách dài:
 *    {loading && <InlineLoading text="Đang tải thêm..." />}
 * 
 * 🌟 Context Loading cho toàn ứng dụng:
 *    const { showLoading, hideLoading } = useContext(LoadingContext);
 *    showLoading('Đang xử lý...', 'overlay');
 * 
 * 🎨 Fullscreen với logo (ít dùng):
 *    showLoading('Đang tải ứng dụng...', 'fullscreen');
 */

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Đang tải...');
  const [loadingType, setLoadingType] = useState('overlay'); // 'overlay', 'fullscreen', 'inline'

  const showLoading = (text = 'Đang tải...', type = 'overlay') => {
    setLoadingText(text);
    setLoadingType(type);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      showLoading, 
      hideLoading,
      loadingText,
      loadingType 
    }}>
      {children}
      {/* Global Loading Overlay */}
      {isLoading && loadingType === 'fullscreen' && <Loading />}
      {isLoading && loadingType === 'overlay' && <LoadingOverlay visible={true} text={loadingText} />}
    </LoadingContext.Provider>
  );
};


