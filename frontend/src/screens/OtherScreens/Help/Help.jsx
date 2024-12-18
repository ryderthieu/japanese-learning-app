import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Help = () => {
  const faq = [
    { id: 1, question: "Câu hỏi 1", answer: "Câu trả lời 1" },
    { id: 2, question: "Câu hỏi 2", answer: "Câu trả lời 2" },
    { id: 3, question: "Câu hỏi 3", answer: "Câu trả lời 3" },
  ];

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-lg font-bold mb-4">Trợ giúp</Text>
      {faq.map((item) => (
        <View
          key={item.id}
          className="bg-white p-4 mb-3 rounded-lg shadow"
        >
          <Text className="text-base font-semibold">{item.question}</Text>
          <Text className="text-sm text-gray-600 mt-1">{item.answer}</Text>
        </View>
      ))}
      <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mt-4">
        <Text className="text-white text-center">Liên hệ hỗ trợ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Help;
