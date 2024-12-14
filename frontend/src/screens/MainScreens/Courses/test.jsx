import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon

const Courses = ({ navigation }) => {
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Danh mục hiện tại

  const allCourses = [
    { id: 1, title: 'Ngữ pháp cơ bản N5', category: 'Ôn JLPT', level: 'N5', image: 'https://via.placeholder.com/150', price: 200000 },
    { id: 2, title: 'Luyện nghe N4 nâng cao', category: 'Ôn JLPT', level: 'N4', image: 'https://via.placeholder.com/150', price: 250000 },
    { id: 3, title: 'Kanji N3', category: 'Ôn JLPT', level: 'N3', image: 'https://via.placeholder.com/150', price: 300000 },
    { id: 4, title: 'Ngữ pháp N2', category: 'Ôn JLPT', level: 'N2', image: 'https://via.placeholder.com/150', price: 350000 },
    { id: 5, title: 'Kaiwa cơ bản', category: 'Hội thoại', level: 'N5', image: 'https://via.placeholder.com/150', price: 400000 },
    { id: 6, title: 'Kaiwa nâng cao', category: 'Hội thoại', level: 'N2', image: 'https://via.placeholder.com/150', price: 500000 },
    { id: 7, title: 'Tiếng Nhật kinh doanh', category: 'Khác', level: 'N1', image: 'https://via.placeholder.com/150', price: 600000 },
    { id: 8, title: 'Tiếng Nhật IT', category: 'Khác', level: 'N2', image: 'https://via.placeholder.com/150', price: 700000 },
  ];

  // Các khóa học theo từng danh mục
  const jlptCourses = allCourses.filter(course => course.category === 'Ôn JLPT');
  const kaiwaCourses = allCourses.filter(course => course.category === 'Hội thoại');
  const businessCourses = allCourses.filter(course => course.category === 'Khác');

  const filteredCourses = selectedCategory === 'jlpt' ? jlptCourses :
                          selectedCategory === 'kaiwa' ? kaiwaCourses : 
                          selectedCategory === 'business' ? businessCourses : allCourses;

  const addToCart = (course) => {
    setCartCount(cartCount + 1);
    alert(`Thêm ${course.title} vào giỏ hàng!`);
  };

  const renderCourse = ({ item }) => (
    <View className="w-1/2 p-2 mb-4">
      <View className="bg-white p-4 rounded-xl shadow-lg h-full">
        <Image source={{ uri: item.image }} className="w-full h-32 rounded-lg mb-4" />
        <Text className="text-lg font-semibold">{item.title}</Text>
        <Text className="text-blue-600">{item.level}</Text>
        <Text className="text-red-600">{item.price === 0 ? 'Miễn phí' : `${item.price} VND`}</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-600 text-white rounded-lg py-2"
          onPress={() => addToCart(item)}
        >
          <Icon name="shopping-cart" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="px-5 py-3">
        {/* Các nút lọc danh mục */}
        <View className="flex-row justify-between mb-5">
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'jlpt' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('jlpt')}
          >
            <Text className={`${selectedCategory === 'jlpt' ? 'text-white' : 'text-gray-700'}`}>Ôn JLPT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'kaiwa' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('kaiwa')}
          >
            <Text className={`${selectedCategory === 'kaiwa' ? 'text-white' : 'text-gray-700'}`}>Hội thoại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'business' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('business')}
          >
            <Text className={`${selectedCategory === 'business' ? 'text-white' : 'text-gray-700'}`}>Khác</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-lg ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onPress={() => setSelectedCategory('all')}
          >
            <Text className={`${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>Tất cả</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị từng danh mục khóa học */}
        {selectedCategory === 'all' || selectedCategory === 'jlpt' ? (
          <View className="mb-6">
            <Text className="text-2xl font-semibold mb-3">Ôn JLPT</Text>
            <FlatList
              data={jlptCourses}
              renderItem={renderCourse}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        ) : null}

        {selectedCategory === 'all' || selectedCategory === 'kaiwa' ? (
          <View className="mb-6">
            <Text className="text-2xl font-semibold mb-3">Hội thoại</Text>
            <FlatList
              data={kaiwaCourses}
              renderItem={renderCourse}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        ) : null}

        {selectedCategory === 'all' || selectedCategory === 'business' ? (
          <View className="mb-6">
            <Text className="text-2xl font-semibold mb-3">Khác</Text>
            <FlatList
              data={businessCourses}
              renderItem={renderCourse}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
            />
          </View>
        ) : null}

        <TouchableOpacity
          className="bg-blue-600 py-3 mt-4 rounded-xl"
          onPress={() => navigation.navigate('AllCourses')}
        >
          <Text className="text-center text-white text-lg">Xem tất cả khóa học</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Courses;
