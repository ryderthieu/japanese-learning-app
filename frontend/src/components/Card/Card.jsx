import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Speech from 'expo-speech';

const SellingCourse = ({ item, addToCart }) => {
    return (
        <View className="w-full">
            <View className="bg-white p-4 rounded-xl shadow-lg flex flex-col">
                <Image source={{ uri: item.thumbnail }} className="w-full h-32 rounded-lg mb-2" />
                <Text className="text-lg font-bold min-h-[50px] align-middle">{item.title.length > 26
                    ? `${item.title.substring(0, 26)}...`
                    : item.title}</Text>
                <Text className="text-lg text-secondary font-bold">{item.level}</Text>
                <View className="justify-between flex-row">
                    <Text className="text-lg text-red-600 font-bold">
                        {item.price === 0 ? 'Miễn phí' : `${item.price} VND`}
                    </Text>
                    <TouchableOpacity onPress={addToCart} className="self-end p-1">
                        <Icon name="cart-outline" size={24} color="#0D308C" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

};
const CourseInfo = ({ item }) => {
    return (
        <View className="w-full">
            <View className="bg-white p-4 rounded-xl shadow-lg flex-row align-middle ">
                <Image source={{ uri: item.thumbnail }} className="h-full w-32 rounded-lg mr-4" />
                <View className="flex-col min-h-[100px] justify-between">
                    <Text className="text-lg font-bold">{item.title.length > 29
                    ? `${item.title.substring(0, 26)}...`
                    : item.title}</Text>
                    <View className='flex-row'>
                        <Text className="text-lg  font-bold">Trình độ: </Text>
                        <Text className="text-lg text-secondary font-bold">{item.level}</Text>
                    </View>
                    <View className='flex-row'>
                        <Text className="text-lg font-bold">Tiến độ: </Text>
                        <Text className='text-lg font-normal'>{item.status}</Text>
                    </View>
                    <View className='flex-row gap-2 align-middle'>
                        <View className="mt-3 bg-gray-300 h-2 rounded-2xl flex-row w-[200px]">
                            <View
                                className="h-full bg-secondary"
                                style={{ width: `${item.progress}%` }} // Phần trăm hoàn thành
                            />
                        </View>
                        <Text className='text-lg text-secondary font-bold'>{`${item.progress}%`}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}


const VocabularyCard = ({ item }) => {
    const speak = (word) => {
        Speech.speak(word, {
            language: 'ja',
            pitch: 1,
            rate: 1,
        });
    };

    return (
        <View className="bg-white p-5 rounded-lg shadow-lg mb-6 border-l-4 border-pink-500 relative">
            <View className="flex-row justify-between items-center  border-gray-300 pb-2">
                <Text className="text-2xl font-semibold text-blue-700">{`${item.kanji ? item.kanji : item.word}`}</Text>
                <TouchableOpacity onPress={() => speak(item.word)}>
                    <Icon name="volume-medium-outline" size={28} color="#FF4081" />
                </TouchableOpacity>
            </View>

            {item.kanji && (
                <Text className="text-lg font-semibold text-blue-700 mb-2">{item.word}</Text>
            )}
            {item.romanji && <Text className="text-pink-500 mt-1 italic">{item.romanji}</Text> }
            

            <Text className="text-gray-800 mt-2 text-base">{item.meaning}</Text>

            <Text className="text-xl font-semibold mt-4 text-blue-600">Ví dụ</Text>

            {item.example.map((example, index) => (
                <View key={index} className="mb-3">
                    <Text className="text-gray-800 mt-1">{example.sentence}</Text>
                    <Text className="text-gray-600 mt-1 italic">{example.translation || example.sentenceMeaning}</Text>
                </View>
            ))}
        </View>

    );
};

export default VocabularyCard;


const GrammarCard = ({ item }) => {
    return (
        <View className="bg-white p-5 rounded-lg shadow-lg mb-6 border-l-4 border-pink-500">
            <Text className="text-xl font-semibold text-blue-700 mb-2">{item.rule}</Text>
            <Text className="text-base font-medium text-gray-600 mb-4">{item.meaning}</Text>
            
            {item.example && Array.isArray(item.example) && item.example.length > 0 ? (
                <View>
                    <Text className="text-xl font-semibold mt-4 text-blue-600">Ví dụ:</Text>
                    {item.example.map((example, index) => (
                        <View key={index} className="mb-3">
                            <Text className="text-lg text-gray-800 font-medium">{example.sentence}</Text>
                            <Text className="text-gray-600 italic">{example.translation}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text className="text-gray-500 mt-2">Không có ví dụ cho ngữ pháp này</Text>
            )}
        </View>
    );
};



export { SellingCourse, CourseInfo, VocabularyCard, GrammarCard }