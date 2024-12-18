import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import FreeDocumentComponent from "./FreeDocumentComponent";
import coursesData from "./coursesData";

const FreeDocumentAll1 = () => {


  return (
   <SafeAreaView>
   <ScrollView showsVerticalScrollIndicator={false}>
    <View className="flex flex-col bg-slate-100 gap-7">
        <View className="flex flex-col gap-5">
            <View className="px-2 flex flex-row justify-between items-center">
                <Text className="text-2xl font-bold">Tài liệu mới cập nhật</Text>
                <TouchableOpacity><Text className="text-xl font-medium text-[#2B308B]">Xem tất cả</Text></TouchableOpacity>
            </View>
            <FreeDocumentComponent data={coursesData} display="Vertical" />
        </View>
        
    </View>
    
    </ScrollView>
    </SafeAreaView>
  );
};

export default FreeDocumentAll1
