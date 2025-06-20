import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import N5VocabData from './data/N5VocabData'; 
import N4VocabData from './data/N4VocabData';
import N3VocabData from './data/N3VocabData';
import N2VocabData from './data/N2VocabData';
import N1VocabData from './data/N1VocabData';
import Icon from 'react-native-vector-icons/Ionicons';

const VocabList = ({navigation, route}) => {
    const { LessonId } = route.params;
    const { level } = route.params;
    
    console.log('Người dùng chọn bài ' + LessonId + ' và level ' + level)
    
    let data = [];
    switch (level) {
        case 'N5':
            data = N5VocabData[`lesson${LessonId}`];
            break;
        case 'N4':
            data = N4VocabData[`lesson${LessonId}`];
            break;
        case 'N3':
            data = N3VocabData[`lesson${LessonId}`];
            break;
        case 'N2':
            data = N2VocabData[`lesson${LessonId}`];
            break;
        default:
            data = N1VocabData[`lesson${LessonId}`];
            break;
    }

    if (data && data.length === 0) {
        console.log('Dữ liệu trống');
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Vocab', { level: level ,LessonId: LessonId, VocabId: item.id })}
                        activeOpacity={0.8}
                    >
                        <View className="relative flex-row items-center justify-between p-4 mb-3 bg-white rounded-2xl border border-gray-100"
                            style={{
                                elevation: 1,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                            }}
                        >
                            {/* Thanh màu hồng */}
                            <View className="absolute w-1 h-12 bg-pink-500 rounded-full left-0" />

                            {/* Nội dung từ vựng */}
                            <View className="ml-4 flex-1">
                                <Text className="text-lg font-bold text-gray-800 mb-1">
                                    {item.word}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {`(${item.furigana})`}
                                </Text>
                            </View>

                            {/* Ý nghĩa từ */}
                            <View className="flex-1 items-end mr-3">
                                <Text className="text-base font-medium text-pink-600 text-right">
                                    {item.examples[0].title}
                                </Text>
                            </View>

                            {/* Arrow Icon */}
                            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                                <Icon name="chevron-forward" size={16} color="#6B7280" />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View className='flex-1 justify-center items-center px-6 py-20'>
                        <Image
                            source={require('./empty.png')}
                            style={{width: 250, height: 250}}
                            className="mb-4"
                        />
                        <Text className='text-gray-400 text-xl font-semibold text-center'>Không có dữ liệu</Text>
                        <Text className='text-gray-400 text-sm text-center mt-2'>
                            Chưa có từ vựng nào cho bài học này
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default VocabList