import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const DocumentLevel = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView>
        <View className="flex flex-col gap-10"> {/* View lớn */}
          <View className="flex flex-col gap-5"> {/* View theo trình độ */}
            <Image
              source={{ uri: "https://via.placeholder.com/600x300" }} // Thay link hình ảnh phù hợp
              className="w-full h-48"
            />
            <Text className="text-black font-bold text-xl">Trình độ N5</Text>
            <View className="flex flex-col px-4 gap-5">
              {/* Từ Vựng */}
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectVocabLesson', {level: 'N5', topic: 'vocab'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Từ Vựng
                  </Text>
                </TouchableOpacity>
                {/* Kanji */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectKanjiLesson', {level: 'N5', topic: 'kanji'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Kanji
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Kanji
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-between">
                {/* Hội Thoại */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Hội Thoại
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ngữ pháp
                  </Text>
                </TouchableOpacity>

                {/* Luyện Từ Vựng */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Luyện Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ôn tập
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-5"> {/* View theo trình độ */}
            <Image
              source={{ uri: "https://via.placeholder.com/600x300" }} // Thay link hình ảnh phù hợp
              className="w-full h-48"
            />
            <Text className="text-black font-bold text-xl">Trình độ N4</Text>
            <View className="flex flex-col px-4 gap-5">
              {/* Từ Vựng */}
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectVocabLesson', {level: 'N4', topic: 'vocab'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Từ Vựng
                  </Text>
                </TouchableOpacity>
                {/* Kanji */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectKanjiLesson', {level: 'N4', topic: 'kanji'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Kanji
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Kanji
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-between">
                {/* Hội Thoại */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Hội Thoại
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ngữ pháp
                  </Text>
                </TouchableOpacity>

                {/* Luyện Từ Vựng */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Luyện Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ôn tập
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-5"> {/* View theo trình độ */}
            <Image
              source={{ uri: "https://via.placeholder.com/600x300" }} // Thay link hình ảnh phù hợp
              className="w-full h-48"
            />
            <Text className="text-black font-bold text-xl">Trình độ N3</Text>
            <View className="flex flex-col px-4 gap-5">
              {/* Từ Vựng */}
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectVocabLesson', {level: 'N3', topic: 'vocab'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Từ Vựng
                  </Text>
                </TouchableOpacity>
                {/* Kanji */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectKanjiLesson', {level: 'N3', topic: 'kanji'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Kanji
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Kanji
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-between">
                {/* Hội Thoại */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Hội Thoại
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ngữ pháp
                  </Text>
                </TouchableOpacity>

                {/* Luyện Từ Vựng */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Luyện Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ôn tập
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-5"> {/* View theo trình độ */}
            <Image
              source={{ uri: "https://via.placeholder.com/600x300" }} // Thay link hình ảnh phù hợp
              className="w-full h-48"
            />
            <Text className="text-black font-bold text-xl">Trình độ N2</Text>
            <View className="flex flex-col px-4 gap-5">
              {/* Từ Vựng */}
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectVocabLesson', {level: 'N2', topic: 'vocab'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Từ Vựng
                  </Text>
                </TouchableOpacity>
                {/* Kanji */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectKanjiLesson', {level: 'N2', topic: 'kanji'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Kanji
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Kanji
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-between">
                {/* Hội Thoại */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Hội Thoại
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ngữ pháp
                  </Text>
                </TouchableOpacity>

                {/* Luyện Từ Vựng */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Luyện Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ôn tập
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-5"> {/* View theo trình độ */}
            <Image
              source={{ uri: "https://via.placeholder.com/600x300" }} // Thay link hình ảnh phù hợp
              className="w-full h-48"
            />
            <Text className="text-black font-bold text-xl">Trình độ N1</Text>
            <View className="flex flex-col px-4 gap-5">
              {/* Từ Vựng */}
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectVocabLesson', {level: 'N1', topic: 'vocab'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Từ Vựng
                  </Text>
                </TouchableOpacity>
                {/* Kanji */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm" onPress={() => navigation.navigate('SelectKanjiLesson', {level: 'N1', topic: 'kanji'})}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Kanji
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Kanji
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex flex-row justify-between">
                {/* Hội Thoại */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Hội Thoại
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ngữ pháp
                  </Text>
                </TouchableOpacity>

                {/* Luyện Từ Vựng */}
                <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg p-4 items-center shadow-sm">
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }} // Icon Luyện Từ Vựng
                    className="w-12 h-12 mb-2"
                  />
                  <Text className="text-center text-lg font-semibold">
                    Ôn tập
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentLevel;
