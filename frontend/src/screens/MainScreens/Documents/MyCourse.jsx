import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { CourseInfo } from '../../../components/Card/Card';

const allCourses = [
  { id: 1, title: 'Ngữ pháp cơ bản N5', level: 'N5', image: 'https://via.placeholder.com/150', progress: 70 },
  { id: 2, title: 'Luyện nghe N4 nâng cao', level: 'N4', image: 'https://via.placeholder.com/150', progress: 50 },
];

const MyCourses = ({ navigation }) => {
  return (
    <View className="flex-1 p-4">
      <FlatList
        data={allCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Lessons', { course: item })}
            className="mb-4"
          >
            <CourseInfo item={item}/>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyCourses;
