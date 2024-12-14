import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
const SellingCourse = ({ item, addToCart }) => {
    return (
        <View className="w-full">
            <View className="bg-white p-4 rounded-xl shadow-lg flex flex-col">
                <Image source={{ uri: item.image }} className="w-full h-32 rounded-lg mb-2" />
                <View className="border border-white flex-row">
                    <View className="flex-grow">
                        <Text className="text-lg font-bold min-h-[50px] align-middle">{item.title}</Text>
                        <Text className="text-lg text-secondary font-bold">{item.level}</Text>
                        <Text className="text-lg text-red-600 font-bold">
                            {item.price === 0 ? 'Miễn phí' : `${item.price} VND`}
                        </Text>
                    </View>
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
export { SellingCourse, CourseInfo }