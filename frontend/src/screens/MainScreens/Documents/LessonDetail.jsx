import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import YouTube from 'react-native-youtube-iframe';

const LessonDetail = ({ route }) => {
    const { lesson } = route.params;

    if (!lesson) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-lg text-gray-600">Không có dữ liệu bài học</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View>
                <YouTube
                    videoId={lesson.videoUrl}
                    play={true}
                    height={250}
                    width="100%"
                    className="rounded-lg shadow-lg"
                />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">Từ vựng</Text>
                    {lesson.vocabulary ? (
                        lesson.vocabulary.map((word, index) => (
                            <View key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                                <View className="mb-2">
                                    <Text className="text-xl font-semibold text-gray-800">{word.kanji}</Text>
                                    <Text className="text-lg text-gray-600">{word.hiragana}</Text>
                                </View>

                                <Text className="text-lg text-gray-700 mb-2">{word.meaning}</Text>

                                <View className="mb-2">
                                    <Text className="text-lg text-gray-800 italic">Câu ví dụ:</Text>
                                    <Text className="text-lg text-gray-600">{word.exampleSentence}</Text>
                                </View>

                                <Text className="text-lg text-gray-700 mb-4">Nghĩa: {word.exampleMeaning}</Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-500">Không có từ vựng cho bài học này</Text>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">Ngữ pháp</Text>
                    {lesson.grammar ? (
                        lesson.grammar.map((grammarItem, index) => (
                            <View key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
                                <Text className="text-lg text-gray-800 mb-2 font-medium">{grammarItem.rule}</Text>
                                <Text className="text-lg text-gray-600 italic">{grammarItem.example}</Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-500">Không có ngữ pháp cho bài học này</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default LessonDetail;
