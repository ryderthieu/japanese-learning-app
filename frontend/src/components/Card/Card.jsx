import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
const SellingCourse = ({ item, addToCart }) => {
    return (
        <View className="w-full">
            <View className="bg-white p-4 rounded-xl shadow-lg flex flex-col">
                <Image source={{ uri: item.image }} className="w-full h-32 rounded-lg mb-2" />
                <Text className="text-lg font-bold min-h-[50px] align-middle">{item.title}</Text>
                <Text className="text-lg text-secondary font-bold">{item.level}</Text>
                <View className="justify-between flex-row">
                    <Text className="text-lg text-red-600 font-bold">
                        {item.price === 0 ? 'Miễn phí' : `${item.price} VND`}
                    </Text>
                    <TouchableOpacity onPress={addToCart} className="self-end">
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
                <Image source={{ uri: item.image }} className="h-full w-32 rounded-lg mr-4" />
                <View className="flex-col min-h-[100px] justify-between">
                    <Text className="text-lg font-bold">{item.title}</Text>
                    <View className='flex-row'>
                        <Text className="text-lg  font-bold">Trình độ: </Text>
                        <Text className="text-lg text-secondary font-bold">{item.level}</Text>
                    </View>
                    <View className='flex-row'>
                        <Text className="text-lg font-bold">Tiến độ: </Text>
                        <Text className='text-lg font-normal'>{item.status}</Text>
                    </View>
                    <View className='flex-row gap-2 align-middle'>
                        <View className="mt-3 bg-gray-300 h-2 rounded-2xl flex-row">
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

const VocabularyCard = ({item}) => {
    return (
        <View className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-pink-400">
            <Text className="text-xl font-bold text-blue-800">{item.kanji} ({item.hiragana})</Text>
            <Text className="text-pink-600 mt-1 italic">{item.romanji}</Text>
            <Text className="text-gray-700 mt-2">{item.meaning}</Text>
            <Text className="text-gray-400 mt-2 italic">
                {item.exampleSentence}
            </Text>
            <Text className="text-gray-400 mt-2 italic">
                {item.exampleMeaning}
            </Text>
        </View>
    )
}

const GrammarCard = ({item}) => {
    return (
        <View className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-pink-400">
            <Text className="text-xl font-bold text-blue-800">{item.rule}</Text>
            <Text className="text-gray-700 mt-2">{item.example}</Text>


        </View>
    )
}
export { SellingCourse, CourseInfo, VocabularyCard, GrammarCard }