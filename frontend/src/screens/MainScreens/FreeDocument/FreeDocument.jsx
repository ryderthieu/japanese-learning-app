import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import FreeDocumentComponent from "./FreeDocumentComponent";
import coursesData from "./coursesData";
import { SafeAreaView } from "react-native-safe-area-context";
const FreeDocument = ({navigation}) => {


  return (
   <SafeAreaView>
   <ScrollView>
    <View className="flex flex-col bg-slate-100 gap-7">
        <View className="flex flex-col gap-5">
            <View className="px-2 flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold">Tài liệu mới cập nhật</Text>
                <TouchableOpacity onPress={() => navigation.navigate('FreeDocumentAll1')}><Text className="text-xl font-medium text-[#2B308B]">Xem tất cả</Text></TouchableOpacity>
            </View>
            <FreeDocumentComponent data={coursesData} display="Horizontal" />
        </View>
        <View className="flex flex-col gap-5">
            <View className="px-2 flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold">Mina no Nihongo N5</Text>
                <TouchableOpacity><Text className="text-xl font-medium text-[#2B308B]">Xem tất cả</Text></TouchableOpacity>
            </View>
            <FreeDocumentComponent data={coursesData} display="Horizontal" />
        </View>
        <View className="flex flex-col gap-5">
            <View className="px-2 flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold">Tự tin giao tiếp</Text>
                <TouchableOpacity><Text className="text-xl font-medium text-[#2B308B]">Xem tất cả</Text></TouchableOpacity>
            </View>
            <FreeDocumentComponent data={coursesData} display="Horizontal" />
        </View>
        <View className="flex flex-col gap-5">
            <View className="px-2 flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold">Chuyên ngành CNTT</Text>
                <TouchableOpacity><Text className="text-xl font-medium text-[#2B308B]">Xem tất cả</Text></TouchableOpacity>
            </View>
            <FreeDocumentComponent data={coursesData} display="Horizontal" />
        </View>
    </View>
    
    </ScrollView>
    </SafeAreaView>
  );
};

export default FreeDocument;
