import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from '@react-navigation/native';

const FreeDocumentComponent = ({ data = [],filter = "all", level ="không có" ,topic = "không có"}) => {
  
    const navigation = useNavigation();

  
    const filteredCourses = data.filter((course) => {
    if (filter === "completed") return course.status === "completed";
    if (filter === "not-learned") return course.status === "not-learned";
    if (filter === "in-progress") return course.status === "in-progress";
    return true; 
  });

  return (
   <ScrollView showsVerticalScrollIndicator={false}>
    <View className="px-2 flex flex-col justify-center items-center gap-5"> 
      {filteredCourses.map((course, index) => (
        <View key={course.id} className="w-[365px] h-[125px] flex flex-row bg-white rounded-3xl shadow-sm">
          <View className="relative w-[140px]">
            {course.status === "completed" ? (
              <View style={{backgroundColor: 'rgba(52, 52, 52, 0.5)'}} className="absolute z-10 inset-0 rounded-s-3xl bg-black flex items-center justify-center">
                <Text className="text-pink-300 font-bold text-xl border-2 border-pink-300 px-4 py-2 rounded-xl">
                  Hoàn thành
                </Text>
              </View>
            ) : null}
            {course.status === "in-progress" ? (
              <>
                <View style={{backgroundColor: 'rgba(52, 52, 52, 0.5)'}} className="absolute z-10 inset-0 bg-black bg-opacity-50 rounded-s-3xl flex items-center justify-center">
                  <Text className="text-[#4df300] font-extrabold text-4xl ">{
                    course.progress || 0 
                  }%</Text>
                </View>
              </>
            ) : null} 
            <Image
              source= {{uri: course.image}}
              className="w-[140px] h-[125px] object-cover rounded-s-3xl"
              resizeMode="cover"
            />
          </View>

          {/* Nội dung khóa học */}
          <View className="flex flex-col gap-2 p-2 w-[225px] ">
            <Text 
            className="text-xl font-bold text-[#07152F]" numberOfLines={1}>
              {course.title}
            </Text>
            <Text
              className="text-sm text-gray-600 h-[40px]"
              numberOfLines={2} 
            >
              {course.description}
            </Text>
            <View className="mr-3">
              {course.status === "completed" ? (
                  <TouchableOpacity onPress={() => {
                    if (topic === 'Vocab') {
                      navigation.navigate('VocabList', { LessonId: course.id, level: level });
                    } else if (topic === 'Kanji') {
                      navigation.navigate('KanjiList', { LessonId: course.id, level: level  });
                    }
                  }}>
                    <Text className="text-lg text-right font-bold text-green-600">
                      Học lại
                    </Text>
                  </TouchableOpacity>
              ) : null}
              {course.status === "not-learned" ? (
                  <TouchableOpacity onPress={() => {
                    if (topic === 'Vocab') {
                      navigation.navigate('VocabList', { LessonId: course.id, level: level  });
                    } else if (topic === 'Kanji') {
                      navigation.navigate('KanjiList', { LessonId: course.id, level: level  });
                    }
                  }}>
                    <Text className="text-lg text-right font-bold text-[#d50f0f]">
                      Bắt đầu học
                    </Text>
                  </TouchableOpacity>
              ) : null}
              {course.status === "in-progress" ? (
                  <TouchableOpacity onPress={() => {
                    if (topic === 'Vocab') {
                      navigation.navigate('VocabList', { LessonId: course.id, level: level  });
                    } else if (topic === 'Kanji') {
                      navigation.navigate('KanjiList', { LessonId: course.id, level: level  });
                    }
                  }}>
                    <Text className="text-lg text-right font-bold text-[#ff7300]">
                      Tiếp tục học
                    </Text>
                  </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      ))}
    </View>
    </ScrollView>
  );
};

export default FreeDocumentComponent
