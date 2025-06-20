import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SellingCourse } from '../../../components/Card/Card';
import { CartContext } from '../../../context/CartContext';
import { LoadingSpinner } from '../../../context/LoadingContext';
import { ModalContext } from '../../../context/ModalContext';
import courseService from '../../../api/courseService';
import userService from '../../../api/userService';

const Courses = () => {
  const [cartCount, setCartCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const {cartItems, setRefresh} = useContext(CartContext)
  const {openModal, closeModal} = useContext(ModalContext)

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const navigation = useNavigation();

  const [allCourses, setAllCourses] = useState([]);
    
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await courseService.getAllCourses();
        
        // Backend trả về { courses: [...], pagination: {...} }
        if (response && Array.isArray(response.courses)) {
          setAllCourses(response.courses)
        } else if (Array.isArray(response)) {
          setAllCourses(response)
        } else {
          setAllCourses([])
          openModal({type: 'error', message: 'Dữ liệu khóa học không đúng định dạng'})
        }
      } catch (error) {
        setAllCourses([])
        openModal({type: 'error', message: error.response?.data?.message || 'Lỗi khi tải khóa học'})
      } finally {
        setLoading(false)
      }
    };
    fetchCourses();
  }, []); 

  useEffect(() => {
    setCartCount(cartItems.length)
  }, [cartItems])

  const addToCart = async (course) => {
    try {
      await userService.addToCart({ courseId: course._id });
      setRefresh(prev => !prev)
      openModal({type: 'success', message: 'Thêm khóa học vào giỏ hàng thành công!'})
    } catch (error) {
      openModal({type: 'error', message: error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng'})
    }
  };

  // Đảm bảo allCourses luôn là array trước khi filter
  const safeAllCourses = Array.isArray(allCourses) ? allCourses : [];
  const jlptCourses = safeAllCourses.filter(course => course.type === 'JLPT');
  const kaiwaCourses = safeAllCourses.filter(course => course.type === 'kaiwa');
  const otherCourses = safeAllCourses.filter(course => course.type === 'other');

  const Category = ({ data, title }) => {
    // Không hiển thị category nếu không có dữ liệu
    if (!data || data.length === 0) {
      return null;
    }
    
    const displayData = showAll ? data : data.slice(0, 4); 

    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-black text-primary">{title}</Text>
        </View>
        <FlatList
          data={displayData}
          renderItem={({ item }) => (
            <TouchableOpacity className='w-1/2 p-2 max-h-[300px]' onPress={() => navigation.navigate('CourseDetail', { item })}>
              <SellingCourse item={item} addToCart={() => addToCart(item)} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />
        {!showAll && data.length > 4 && (
          <TouchableOpacity onPress={() => setShowAll(true)} className="mt-3">
            <Text className="text-primary text-lg font-bold">Xem thêm</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) return <LoadingSpinner text="Đang tải khóa học..." />

  // Kiểm tra nếu không có khóa học nào
  if (safeAllCourses.length === 0 && !loading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center p-5">
        <View className="bg-white rounded-xl p-8 shadow-md items-center">
          <Icon name="book-outline" size={80} color="#ccc" />
          <Text className="text-xl font-bold text-gray-600 mt-4 mb-2">
            Chưa có khóa học nào
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Hiện tại chưa có khóa học nào được thêm vào hệ thống.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeNavigation')}
            className="bg-pink-500 py-3 px-6 rounded-lg"
          >
            <Text className="text-white font-semibold">Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-5">
        <View className="flex-row justify-between mb-5">
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('all')}
          >
            <Text className={`${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'jlpt' ? 'bg-primary text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('jlpt')}
          >
            <Text className={`${selectedCategory === 'jlpt' ? 'text-white' : 'text-gray-700'}`}>Ôn JLPT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'kaiwa' ? 'bg-primary text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('kaiwa')}
          >
            <Text className={`${selectedCategory === 'kaiwa' ? 'text-white' : 'text-gray-700'}`}>Hội thoại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'business' ? 'bg-primary text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('business')}
          >
            <Text className={`${selectedCategory === 'business' ? 'text-white' : 'text-gray-700'}`}>Khác</Text>
          </TouchableOpacity>
        </View>

        {(selectedCategory === 'all' || selectedCategory === 'jlpt') && (
          <Category data={jlptCourses} title={'Ôn JLPT'} />
        )}

        {(selectedCategory === 'all' || selectedCategory === 'kaiwa') && (
          <Category data={kaiwaCourses} title={'Hội thoại'} />
        )}

        {(selectedCategory === 'all' || selectedCategory === 'business') && (
          <Category data={otherCourses} title={'Khác'} />
        )}
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-16 right-5 bg-primary p-4 rounded-full shadow-lg"
        onPress={() => navigation.navigate('Cart')}
      >
        <Icon name="cart-outline" size={28} color="#fff" />
        {cartCount > 0 && (
          <View className="absolute top-[-5px] right-[-5px] bg-red-500 rounded-full w-6 h-6 justify-center items-center">
            <Text className="text-white text-xs">{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Courses;