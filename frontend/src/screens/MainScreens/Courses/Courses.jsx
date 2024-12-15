import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SellingCourse } from '../../../components/Card/Card';

const Courses = () => {
  const [cartCount, setCartCount] = useState(0); 
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const navigation = useNavigation();

  const allCourses = [
    { id: 10, title: '2235345111111111', category: 'Ôn JLPT', level: 'N5', image: 'https://via.placeholder.com/150', price: 0},
    { id: 2, title: 'Luyện nghe N4 nâng cao', category: 'Ôn JLPT', level: 'N4', image: 'https://via.placeholder.com/150', price: 250000 },
    { id: 3, title: 'Kanji N3', category: 'Ôn JLPT', level: 'N3', image: 'https://via.placeholder.com/150', price: 300000 },
    { id: 4, title: 'Ngữ pháp N2', category: 'Ôn JLPT', level: 'N2', image: 'https://via.placeholder.com/150', price: 350000 },
    { id: 5, title: 'Kaiwa cơ bản', category: 'Hội thoại', level: 'N5', image: 'https://via.placeholder.com/150', price: 400000 },
    { id: 6, title: 'Kaiwa nâng cao', category: 'Hội thoại', level: 'N2', image: 'https://via.placeholder.com/150', price: 500000 },
    { id: 7, title: 'Tiếng Nhật kinh doanh', category: 'Khác', level: 'N1', image: 'https://via.placeholder.com/150', price: 600000 },
    { id: 8, title: 'Tiếng Nhật IT', category: 'Khác', level: 'N2', image: 'https://via.placeholder.com/150', price: 700000 },
    { id: 1, title: 'Minato - Minna no Nihongo 1', category: 'Ôn JLPT', level: 'N5', image: 'https://via.placeholder.com/150', price: 200000 },
  ];

  const addToCart = useCallback((course) => {
    setCartCount((prevCount) => prevCount + 1);
    alert(`Thêm ${course.title} vào giỏ hàng!`);
  }, []);

  const jlptCourses = allCourses.filter(course => course.category === 'Ôn JLPT');
  const kaiwaCourses = allCourses.filter(course => course.category === 'Hội thoại');
  const businessCourses = allCourses.filter(course => course.category === 'Khác');

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
          keyExtractor={(item) => item.id.toString()}
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
          <Category data={businessCourses} title={'Khác'} />
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
