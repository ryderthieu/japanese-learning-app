import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from '@react-navigation/native';

const FreeDocumentComponent = ({ data = [],filter = "all", display="Vertical"}) => {
  
    const navigation = useNavigation();
  
    const filteredCourses = data.filter((course) => {
    if (filter === "completed") return course.status === "completed";
    if (filter === "not-learned") return course.status === "not-learned";
    if (filter === "in-progress") return course.status === "in-progress";
    return true; // Hiển thị tất cả
  });

  return (
   <SafeAreaView>
   <ScrollView horizontal={display === 'Horizontal'} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
    <View className={`px-2 flex flex-row ${display === 'Vertical' ? 'flex-wrap justify-between' : 'gap-3'} `}> {/* Grid layout */}
      {filteredCourses.map((course, index) => (
        <View className="w-[185px] h-[250px] bg-white rounded-3xl shadow-lg overflow-hidden mb-4">
          <View className="relative">
            {course.status === "completed" && (
              <View style={{backgroundColor: 'rgba(52, 52, 52, 0.5)'}} className="absolute z-10 inset-0 bg-black flex items-center justify-center ">
                <Text className="text-pink-300 font-bold text-xl border-2 border-pink-300 px-4 py-2 rounded-xl">
                  Hoàn thành
                </Text>
              </View>
            )}
            {course.status === "in-progress" && (
              <>
                <View style={{backgroundColor: 'rgba(52, 52, 52, 0.5)'}} className="absolute z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Text className="text-[#5A81FA] font-extrabold text-4xl">{
                    course.progress || 0
                  }%</Text>
                </View>
                <View
                  className="absolute z-20 bottom-0 left-0 bg-[#5A81FA] h-2"
                  style={{ width: `${course.progress}%` }}
                ></View>
              </>
            )}
            <Image
              source={course.image}
              className="w-full h-[110px] object-cover"
              resizeMode="cover"
            />
          </View>

          {/* Nội dung khóa học */}
          <View className="p-4">
            <Text 
            className="text-xl font-bold text-[#07152F]" numberOfLines={1}>
              {course.title}
            </Text>
            <Text
              className="mt-2 text-sm text-gray-600"
              numberOfLines={2} // Giới hạn mô tả trong 2 dòng
            >
              {course.description}
            </Text>
            <View className="mt-4 flex-row gap-2">
              {course.status === "completed" && (
                  <TouchableOpacity className="flex-1 py-2 bg-[#F490AF] rounded-md hover:bg-[#FF0854]" onPress={() => navigation.navigate('Vocab')}>
                    <Text className="text-center font-bold text-white text-sm">
                      Học lại
                    </Text>
                  </TouchableOpacity>
              )}
              {course.status === "not-learned" && (
                  <TouchableOpacity className="flex-1 py-2 bg-[#2B308B] rounded-md hover:bg-blue-700">
                    <Text className="text-center font-bold text-white text-sm">
                      Bắt đầu học
                    </Text>
                  </TouchableOpacity>
              )}
              {course.status === "in-progress" && (
                  <TouchableOpacity className="flex-1 py-2 bg-[#2B308B] rounded-md hover:bg-blue-700">
                    <Text className="text-center font-bold text-white text-sm">
                      Tiếp tục học
                    </Text>
                  </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default FreeDocumentComponent
