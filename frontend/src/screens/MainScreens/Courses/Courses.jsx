import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SellingCourse } from '../../../components/Card/Card';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { CartContext } from '../../../context/CartContext';
import { LoadingContext } from '../../../context/LoadingContext';
import Loading from '../../../components/Loading/Loading';
const Courses = () => {
  const {token} = useContext(AuthContext)
  const [cartCount, setCartCount] = useState(0); 
  const {cartItems, setRefresh} = useContext(CartContext)
  const {isLoading, setIsLoading} = useContext(LoadingContext)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const navigation = useNavigation();

  const [allCourses, setAllCourses] = useState([{_id: '', title: '', description: '', level: '', price: '', thumbnail: '',type: '', lessons: []}]);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('http://10.0.2.2:3000/api/courses'); 
        setAllCourses(response.data)
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setIsLoading(false)
      }
    };
    fetchCourses();
  }, []); 

  useEffect(() => {
    console.log(token)
    setCartCount(cartItems.length)
  }, [cartItems])

  const addToCart = async (course) => {
    try {
      await axios.post("http://10.0.2.2:3000/api/user/add-to-cart", { courseId: course._id },
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      setRefresh(prev => !prev)
      alert('Thêm khóa học vào giỏ hàng thành công!')

    } catch (error){
      console.log('Lỗi', error.message);
    }
  };

  const jlptCourses = allCourses.filter(course => course.type === 'JLPT');
  const kaiwaCourses = allCourses.filter(course => course.type === 'kaiwa');
  const otherCourses = allCourses.filter(course => course.type === 'other');

  const Category = ({ data, title }) => {
    const displayData = showAll ? data : data.slice(0, 4); 

    return (
      <View className="mb-6">
        <Text className="text-2xl font-black mb-3 text-primary">{title}</Text>
        <FlatList
          data={displayData}
          renderItem={({ item }) => (
            <TouchableOpacity className='w-1/2 p-2 max-h-[300px]' onPress={() => navigation.navigate('CourseDetail', { item })}>
              <SellingCourse item={item} addToCart={() => addToCart(item)} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
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
  if (isLoading) return <Loading />

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
